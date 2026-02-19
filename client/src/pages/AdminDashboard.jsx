import { useEffect, useState } from "react";
import api from "../services/api";
import CommentSection from "../components/CommentSection";

const BLOGS_PER_PAGE = 10;

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      setUpdatingId(id);

      await api.put(`/blogs/updateblog/${id}`, {
        status: newStatus,
      });

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

  const deleteBlog = async (id) => {
    try {
      setDeletingId(id);

      await api.delete(`/blogs/deleteblog/${id}`);

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Failed to delete blog", error);
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------------- Pagination Logic ---------------- */

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* -------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10 text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>

          {/* Pagination (Top Right) */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
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
        </div>

        {/* Blog List */}
        <div className="space-y-8">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-3 text-white">
                {blog.title}
              </h3>

              <p className="text-gray-300 mb-4 line-clamp-3">{blog.content}</p>

              <p className="text-sm text-gray-400">
                Author:{" "}
                <span className="font-medium text-gray-200">
                  {blog.author?.name}
                </span>
              </p>

              {/* Status */}
              <div className="mt-5 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-400">
                  Status:
                </label>

                <select
                  value={blog.status}
                  onChange={(e) => updateStatus(blog._id, e.target.value)}
                  disabled={updatingId === blog._id}
                  className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="publish">Publish</option>
                </select>

                {updatingId === blog._id && (
                  <span className="text-sm text-blue-400">Updating...</span>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteBlog(blog._id)}
                disabled={deletingId === blog._id}
                className={`mt-5 px-4 py-2 rounded-md text-sm font-medium transition ${
                  deletingId === blog._id
                    ? "bg-red-400 cursor-not-allowed text-black"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {deletingId === blog._id ? "Deleting..." : "Delete Blog"}
              </button>

              {/* Comments */}
              <div className="mt-6 border-t border-gray-700 pt-5">
                <CommentSection blogId={blog._id} isAdmin={true} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
