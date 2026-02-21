import { useState, useEffect, useRef } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";

const SearchBar = ({ onSearch, showStatus = false }) => {
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);

  const [filters, setFilters] = useState({
    title: "",
    author: "",
    date: "",
    status: "",
  });

  /* -------- Close dropdown on outside click -------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------- Live search on every change -------- */
  useEffect(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClear = () => {
    setFilters({
      title: "",
      author: "",
      date: "",
      status: "",
    });
  };

  return (
    <div className="relative w-full mb-6" ref={dropdownRef}>
      {/* Search Input */}
      <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
        <FiSearch className="text-gray-400 mr-2" />

        <input
          type="text"
          name="title"
          placeholder="Search..."
          value={filters.title}
          onChange={handleChange}
          className="bg-transparent outline-none flex-1 text-gray-200"
        />

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="ml-2 text-blue-400 hover:text-blue-500"
        >
          <FiFilter size={20} />
        </button>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="absolute right-0 mt-3 w-96 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 z-50">
          <h3 className="font-semibold mb-4 text-lg">Filter Options</h3>

          <div className="space-y-4">
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={filters.author}
              onChange={handleChange}
              className="w-full bg-gray-700 p-2 rounded-md outline-none"
            />

            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="w-full bg-gray-700 p-2 rounded-md outline-none"
            />

            {showStatus && (
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full bg-gray-700 p-2 rounded-md outline-none"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="publish">Publish</option>
              </select>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={handleClear}
                className="border border-blue-500 text-blue-400 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition"
              >
                Clear
              </button>

              <button
                onClick={() => setShowFilters(false)}
                className="bg-gray-600 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
