import { useBlogs } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { removeBlog, toggleLike } = useBlogs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isLiked = blog.likes?.some((id) => id.toString() === user?._id);

  return (
    <div style={{ borderBottom: "1px solid #ddd", marginBottom: 16 }}>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>

      {user && (
        <p style={{ cursor: "pointer" }} onClick={() => toggleLike(blog._id)}>
          {isLiked ? "Unlike " : " ❤️"} {blog.likes?.length || 0}
        </p>
      )}

      <button onClick={() => navigate(`/edit/${blog._id}`)}>Edit</button>
      <button onClick={() => removeBlog(blog._id)}>Delete</button>
    </div>
  );
};

export default BlogCard;
