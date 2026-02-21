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
  <div className="min-h-screen bg-gray-900 flex justify-center items-start px-6 py-12 text-gray-100">
    <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-white">Create Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Title
          </label>
          <input
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Content
          </label>
          <textarea
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full min-h-45 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Save as Draft</option>
            <option value="review">Submit for Review</option>
            <option value="publish">Publish the Blog</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-400 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed text-black"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default CreateBlog;
