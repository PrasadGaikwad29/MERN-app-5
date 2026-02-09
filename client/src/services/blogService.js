import api from "./api";

const getBlogs = () => api.get("/blogs/getallblogs");
const createBlog = (data) => api.post("/blogs/createblog", data);
const updateBlog = (id, data) => api.put(`/blogs/updateblog/${id}`, data);
const deleteBlog = (id) => api.delete(`/blogs/deleteblog/${id}`);
const toggleLikeBlog = (id) => api.post(`/blogs/like/${id}`);

export { getBlogs, createBlog, updateBlog, deleteBlog, toggleLikeBlog };
