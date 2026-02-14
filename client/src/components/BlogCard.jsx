import { useBlogs } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog, showActions = true }) => {
  const { removeBlog, toggleLike } = useBlogs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAuthor = user?._id === blog.author?._id;
  const isAdmin = user?.role === "admin";
  const canModify = isAuthor || isAdmin;

  const isLiked = blog.likes?.some((id) => id.toString() === user?._id);

  return (
    <div style={{ borderBottom: "1px solid #ddd", marginBottom: 16 }}>
      {/* Title always clickable */}
      <h2
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/blogs/${blog._id}`)}
      >
        {blog.title}
      </h2>

      <p style={{ fontSize: "14px", color: "#555" }}>
        By {blog.author?.name} {blog.author?.surname}
      </p>

      {/* Preview if used on Home */}
      {!showActions ? (
        <p>
          {blog.content.slice(0, 150)}...
          <span
            style={{ color: "blue", cursor: "pointer", marginLeft: 8 }}
            onClick={() => navigate(`/blogs/${blog._id}`)}
          >
            Read More
          </span>
        </p>
      ) : (
        <p>{blog.content}</p>
      )}

      {user && (
        <p style={{ cursor: "pointer" }} onClick={() => toggleLike(blog._id)}>
          {isLiked ? "Unlike " : "❤️ "}
          {blog.likes?.length || 0}
        </p>
      )}

      {showActions && canModify && (
        <>
          <button onClick={() => navigate(`/edit/${blog._id}`)}>Edit</button>
          <button onClick={() => removeBlog(blog._id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default BlogCard;
