import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addBlog } = useBlogs();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addBlog({ title, content, status });
      navigate("/userdashboard/myblogs");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Blog</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <br />
      <br />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <br />
      <br />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="draft">Save as Draft</option>
        <option value="review">Submit for Review</option>
        <option value="publish">Publish the Blog</option>
      </select>

      <br />
      <br />

      <button disabled={loading}>{loading ? "Creating..." : "Create"}</button>

      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>
    </form>
  );
};

export default CreateBlog;
