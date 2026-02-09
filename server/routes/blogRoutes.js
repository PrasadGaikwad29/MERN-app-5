import express from "express"
import { createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog, addComment, toggleLike } from "../controllers/blogController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();
router.get("/getallblogs", getAllBlogs);
router.get("/getblogbyid/:id", getBlogById);
router.post("/createblog", auth, createBlog);
router.delete("/deleteblog/:id", auth, deleteBlog);
router.put("/updateblog/:id", auth, updateBlog);
router.post("/comment/:id", auth, addComment);
router.post("/like/:id", auth, toggleLike);

export default router;