import { useEffect, useState } from "react";
import api from "../services/api";
import CommentSection from "../components/CommentSection";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all blogs (admin route)
  const fetchAllBlogs = async () => {
    try {
      const res = await api.get("/blogs/admin/all");
      setBlogs(res.data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  // ✅ Update blog status with loading control
  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      await api.put(`/blogs/updateblog/${id}`, {
        status: newStatus,
      });

      // Update locally instead of refetching
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, status: newStatus } : blog,
        ),
      );
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Delete blog with loading control
  const deleteBlog = async (id) => {
    try {
      setDeletingId(id);

      await api.delete(`/blogs/deleteblog/${id}`);

      // Remove from UI without refetch
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Failed to delete blog", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {blogs.map((blog) => (
        <div
          key={blog._id}
          style={{
            borderBottom: "1px solid #ccc",
            marginTop: 20,
            paddingBottom: 10,
          }}
        >
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <p>Author: {blog.author?.name}</p>

          <div style={{ marginTop: 10 }}>
            <label>Status: </label>
            <select
              value={blog.status}
              onChange={(e) => updateStatus(blog._id, e.target.value)}
              style={{ marginLeft: 10 }}
              disabled={updatingId === blog._id}
            >
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="publish">Publish</option>
            </select>

            {updatingId === blog._id && (
              <span style={{ marginLeft: 10 }}>Updating...</span>
            )}
          </div>

          <button
            onClick={() => deleteBlog(blog._id)}
            disabled={deletingId === blog._id}
            style={{
              marginTop: 10,
              backgroundColor: "red",
              color: "white",
              opacity: deletingId === blog._id ? 0.6 : 1,
            }}
          >
            {deletingId === blog._id ? "Deleting..." : "Delete Blog"}
          </button>

          <CommentSection blogId={blog._id} isAdmin={true} />
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
