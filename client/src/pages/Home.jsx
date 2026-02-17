import { useEffect } from "react";
import { useBlogs } from "../context/BlogContext";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const { blogs, loading, fetchBlogs } = useBlogs();

  useEffect(() => {
    fetchBlogs(); // <-- THIS is what you are missing
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!Array.isArray(blogs)) return null;

  return (
    <div>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} showActions={false} />
      ))}
    </div>
  );
};

export default Home;
