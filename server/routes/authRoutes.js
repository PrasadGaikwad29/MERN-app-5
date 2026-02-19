import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  editProfile,
} from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/edit-profile", auth, editProfile);
export default router;
