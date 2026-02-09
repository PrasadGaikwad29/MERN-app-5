import { createContext, useContext, useEffect, useState } from "react";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
} from "../services/blogService";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getBlogs();
      setBlogs(res.data.blogs || []);
    } finally {
      setLoading(false);
    }
  };
   const addBlog = async (data) => {
    const res = await createBlog(data);
    setBlogs((prev) => [res.data.blog, ...prev]);
  };
  const editBlog = async (id, data) => {
    const res = await updateBlog(id, data);
    setBlogs((prev) => prev.map((b) => (b._id === id ? res.data.blog : b)));
  };

  const removeBlog = async (id) => {
    await deleteBlog(id);
    setBlogs((prev)=>prev.filter((b)=>b._id !== id))
  }
  useEffect(() => {
    fetchBlogs();
  }, []);

  const toggleLike = async (id) => {
    const res = await toggleLikeBlog(id);

    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? res.data.blog : b))
    );
  };

  return (
    <BlogContext.Provider
      value={{ blogs, loading, addBlog, editBlog, removeBlog, toggleLike }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => useContext(BlogContext);
