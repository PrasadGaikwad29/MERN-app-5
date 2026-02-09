import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";

const router = express.Router();
router.get("/admin", auth, isAdmin, (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
})
export default router;
