import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    type: {
      type: String,
      enum: ["status_changed", "blog_deleted", "comment_deleted"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }, // ✅ adds createdAt per notification
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    blogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Blog",
      default: [],
    },
    notifications: {
      type: [notificationSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
