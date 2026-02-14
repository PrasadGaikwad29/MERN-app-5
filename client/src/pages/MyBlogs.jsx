import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [expanded, setExpanded] = useState({}); 
  const navigate = useNavigate();

  const fetchMyBlogs = async () => {
    try {
      const res = await api.get("/blogs/myblogs");
      setBlogs(res.data.blogs || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const deleteBlog = async (id) => {
    await api.delete(`/blogs/deleteblog/${id}`);
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      <br />
      <br />
      <button onClick={() => navigate("/create")}>Create New Blog</button>

      <h2>My Blogs</h2>

      {blogs.map((blog) => {
        const isExpanded = expanded[blog._id];
        const previewLength = 250;

        return (
          <div
            key={blog._id}
            style={{ borderBottom: "1px solid #ccc", marginTop: 20 }}
          >
            <h3>{blog.title}</h3>

            <p>
              {isExpanded ? blog.content : blog.content.slice(0, previewLength)}

              {blog.content.length > previewLength && (
                <span
                  onClick={() => toggleReadMore(blog._id)}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    marginLeft: 8,
                  }}
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </span>
              )}
            </p>

            <p>{blog.author?.name}</p>
            <p>Status: {blog.status}</p>

            <button onClick={() => navigate(`/edit/${blog._id}`)}>Edit</button>

            <button onClick={() => deleteBlog(blog._id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default MyBlogs;
