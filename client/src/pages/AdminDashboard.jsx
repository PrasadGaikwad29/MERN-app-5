import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);

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

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/blogs/updateblog/${id}`, {
        status: newStatus,
      });

      setBlogs((prev) => prev.map((b) => (b._id === id ? res.data.blog : b)));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await api.delete(`/blogs/deleteblog/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Failed to delete blog", error);
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

          {/* Status Dropdown */}
          <div style={{ marginTop: 10 }}>
            <label>Status: </label>
            <select
              value={blog.status}
              onChange={(e) => updateStatus(blog._id, e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="publish">Publish</option>
            </select>
          </div>

          <button
            onClick={() => deleteBlog(blog._id)}
            style={{
              marginTop: 10,
              backgroundColor: "red",
              color: "white",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
