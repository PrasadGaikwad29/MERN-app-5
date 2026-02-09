import { useParams, useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import { useState } from "react";

const EditBlog = () => {
  const { id } = useParams();
  const { blogs, editBlog } = useBlogs();
  const navigate = useNavigate();

  const blog = blogs.find((b) => b._id === id);

  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editBlog(id, { title, content });
    navigate("/");
  };

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
