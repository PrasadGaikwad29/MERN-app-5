import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getMyNotifications,
  markNotificationRead,
  editProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", auth, (req, res) => {
  res.json({
    success: true,
    message: "User profile fetched",
    user: req.user,
  });
});

router.get("/notifications", auth, getMyNotifications);
router.put("/notifications/:id", auth, markNotificationRead);
router.put("/edit-profile", auth, editProfile);

export default router;
