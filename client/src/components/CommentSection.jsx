import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    const res = await api.get(`/blogs/getblogbyid/${blogId}`);
    setComments(res.data.blog.comments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post(`/blogs/comment/${blogId}`, {
      text: content,
    });

    setContent("");
    fetchComments();
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Comments</h3>

      {user && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      )}

      {comments.map((comment, index) => (
        <div key={index} style={{ marginTop: "16px" }}>
          <p>
            <strong>
              {comment.user?.name} {comment.user?.surname}
            </strong>
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
