import Blog from "../models/Blog.js";
import User from "../models/User.js";

/* =======================
   CREATE BLOG
======================= */
export const createBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content required",
      });
    }

    const blog = await Blog.create({
      title,
      content,
      status: status || "draft",
      author: req.user.id,
    });

    // ✅ FIX 1: push blog into User.blogs
    await User.findByIdAndUpdate(req.user.id, {
      $push: { blogs: blog._id },
    });

    const populatedBlog = await blog.populate("author", "name surname role");

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: populatedBlog,
    });
  } catch (error) {
    console.error(error); // ✅ FIX 2
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   PUBLIC BLOGS
======================= */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "publish" })
      .populate("author", "name surname")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    console.error(error); // ✅ FIX 2
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   ADMIN – ALL BLOGS
======================= */
export const getAllBlogsForAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name surname role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All blogs fetched for admin",
      blogs,
    });
  } catch (error) {
    console.error(error); // ✅ FIX 2
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   GET BLOG BY ID
======================= */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name surname role")
      .populate("comments.user", "name surname");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // ✅ FIX 3: allow guest access ONLY for publish blogs
    if (
      blog.status !== "publish" &&
      (!req.user ||
        (blog.author._id.toString() !== req.user.id &&
          req.user.role !== "admin"))
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this blog",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog found",
      blog,
    });
  } catch (error) {
    console.error(error); // ✅ FIX 2
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   UPDATE BLOG
======================= */

export const updateBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // 🔐 Authorization: only author or admin
    const isAuthor = blog.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }

    // ✅ Validate status if provided
    const allowedStatuses = ["draft", "review", "publish"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const previousStatus = blog.status;

    // ✏️ Update fields only if provided
    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.status = status ?? blog.status;

    await blog.save();

    // 🔔 Notify author if ADMIN changed the status
    if (status && previousStatus !== status && isAdmin && !isAuthor) {
      await User.findByIdAndUpdate(blog.author, {
        $push: {
          notifications: {
            message: `Admin changed your blog "${blog.title}" from ${previousStatus} to ${status}.`,
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   DELETE BLOG
======================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await blog.deleteOne();

    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id },
    });

    return res.status(200).json({
      success: true,
      message: "Blog deleted",
    });
  } catch (error) {
    console.error(error); // ✅ FIX 2
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   LIKE / UNLIKE BLOG
======================= */
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // ✅ FIX 4: only published blogs can be liked
    if (blog.status !== "publish") {
      return res.status(403).json({
        success: false,
        message: "Cannot like unpublished blog",
      });
    }

    const userId = req.user.id;
    const isLiked = blog.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error); // ✅ FIX 2
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   ADD COMMENT
======================= */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text required",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.status !== "publish") {
      return res.status(403).json({
        success: false,
        message: "Comments allowed only on published blogs",
      });
    }

    blog.comments.push({
      user: req.user.id,
      text,
    });

    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id).populate(
      "comments.user",
      "name surname",
    );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comments: updatedBlog.comments,
    });
  } catch (error) {
    console.error(error); // ✅ FIX 2
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   USER DASHBOARD
======================= */
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "name surname")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fetched my created blogs", // ✅ FIX 5 (typo)
      blogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =======================
   Change blog status by admin
======================= */

export const adminUpdateBlogStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!["draft", "review", "publish"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔐 Authorization Check
    const isAuthor = blog.author.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({
        message: "You are not authorized to update this blog status",
      });
    }

    const previousStatus = blog.status;
    blog.status = status;
    await blog.save();

    // 🔔 Notify only if admin changed it
    if (isAdmin && !isAuthor) {
      await User.findByIdAndUpdate(blog.author, {
        $push: {
          notifications: {
            message: `Admin changed your blog "${blog.title}" from ${previousStatus} to ${status}.`,
          },
        },
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
