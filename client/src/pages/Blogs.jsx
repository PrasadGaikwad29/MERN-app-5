import { useBlogs } from "../context/BlogContext";
import BlogCard from "../components/BlogCard";

const Blogs = () => {
  const { blogs, loading } = useBlogs();

  if (loading) return <p>Loading...</p>;
  if (!Array.isArray(blogs)) return null;

  return (
    <div>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default Blogs;
