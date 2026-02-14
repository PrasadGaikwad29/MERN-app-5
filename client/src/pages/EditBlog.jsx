import { useParams, useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import { useState, useEffect } from "react";

const EditBlog = () => {
  const { id } = useParams();
  const { blogs, editBlog, fetchSingleBlog } = useBlogs();
  const navigate = useNavigate();

  const existingBlog = blogs.find((b) => b._id === id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      let blog = existingBlog;
      if (!blog) {
        blog = await fetchSingleBlog(id);
      }
      if (blog) {
        setTitle(blog.title);
        setContent(blog.content);
        setStatus(blog.status);
      }
      setLoading(false);
    };
    loadBlog();
  }, [id, existingBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editBlog(id, { title, content, status });
    navigate("/userdashboard/myblogs");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Blog</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <br />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <br />
      <br />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="draft">Draft</option>
        <option value="review">Review</option>
        <option value="publish">Publish</option>
      </select>

      <br />
      <br />

      <button type="submit">Update</button>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ marginLeft: 8 }}
      >
        Cancel
      </button>
    </form>
  );
};

export default EditBlog;
