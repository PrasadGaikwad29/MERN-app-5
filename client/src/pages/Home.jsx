import { useEffect, useState } from "react";
import { useBlogs } from "../context/BlogContext";
import BlogCard from "../components/BlogCard";

const BLOGS_PER_PAGE = 10;

const Home = () => {
  const { blogs, loading, fetchBlogs } = useBlogs();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!Array.isArray(blogs)) return null;

  // Pagination Logic
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
    <div className="max-w-5xl mx-auto ">
      {/* Top Bar: Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mb-8">
          {/* Previous */}
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

          {/* Page Numbers */}
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

          {/* Next */}
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
      <div className="space-y-10">
        {currentBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} showActions={false} />
        ))}
      </div>
    </div>
  </div>
);
};

export default Home;
