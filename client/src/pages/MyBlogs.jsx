import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";

const BLOGS_PER_PAGE = 10;

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
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
    try {
      await api.delete(`/blogs/deleteblog/${id}`);
      fetchMyBlogs();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10 text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">My Blogs</h2>

        <button
          onClick={() => navigate("/create")}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-lg transition"
        >
          Create New Blog
        </button>
      </div>

      {/* Top Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mb-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-lg transition ${
              currentPage === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 text-sm rounded-lg transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-lg transition ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Blog List */}
      <div className="space-y-8">
        {currentBlogs.map((blog) => {
          const isExpanded = expanded[blog._id];
          const previewLength = 250;

          return (
            <div
              key={blog._id}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700"
            >
              <h3 className="text-2xl font-semibold text-white mb-2">
                {blog.title}
              </h3>

              <p className="text-sm text-gray-400 mb-4">
                By {blog.author?.name} {blog.author?.surname}
              </p>

              <p className="text-gray-300 leading-relaxed">
                {isExpanded
                  ? blog.content
                  : blog.content.slice(0, previewLength)}

                {blog.content.length > previewLength && (
                  <span
                    onClick={() => toggleReadMore(blog._id)}
                    className="text-blue-400 cursor-pointer hover:underline ml-1"
                  >
                    {isExpanded ? " Show Less" : "... Read More"}
                  </span>
                )}
              </p>

              <p className="mt-4 text-sm text-gray-400">
                Status:{" "}
                <span className="text-gray-200 font-medium">{blog.status}</span>
              </p>

              {/* Actions */}
              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => navigate(`/edit/${blog._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition"
                >
                  Delete
                </button>
              </div>

              {/* Comments - reduced spacing */}
              <div className="mt-5 border-t border-gray-700 pt-5">
                <CommentSection blogId={blog._id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBlogs;
