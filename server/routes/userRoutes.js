import express from "express"
import { auth } from "../middlewares/auth.js"

const router = express.Router();

router.get("/profile", auth, (req, res) => {
    res.json({
      success: true,
      message: "User profile fetched",
      user: req.user,
    });
})
export default router;