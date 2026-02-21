import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import CommentSection from "../components/CommentSection";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true); // important

        const res = await api.get(`/blogs/getblogbyid/${id}`);
        setBlog(res.data.blog);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
        Blog Not Found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

          <p className="text-gray-400 mb-4">
            By {blog.author?.name} {blog.author?.surname}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            <span className="text-gray-200">
              Likes ({blog.likes?.length || 0})
            </span>
          </p>
          <div className="text-gray-300 leading-relaxed whitespace-pre-line mt-2">
            {blog.content}
          </div>

          <div>
            <CommentSection blogId={blog._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
