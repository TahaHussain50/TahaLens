import express from "express";
import dbConnect from "../middlewares/dbConnect.js";
import {
  editProfile,
  follow,
  followingList,
  getAllNotifications,
  getCurrentUser,
  getProfile,
  markAsRead,
  search,
  suggestedUsers,
} from "../controllers/user.js";
import checkLogin from "../middlewares/checkLogin.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", dbConnect, checkLogin, getCurrentUser);
userRouter.get("/suggested", dbConnect, checkLogin, suggestedUsers);
userRouter.get("/getProfile/:userName", dbConnect, checkLogin, getProfile);
userRouter.get("/follow/:targetUserId", dbConnect, checkLogin, follow);
userRouter.get("/followingList", dbConnect, checkLogin, followingList);
userRouter.get("/search", dbConnect, checkLogin, search);
userRouter.get(
  "/getAllNotifications",
  dbConnect,
  checkLogin,
  getAllNotifications
);
userRouter.post("/markAsRead", dbConnect, checkLogin, markAsRead);

userRouter.post(
  "/editProfile",
  dbConnect,
  checkLogin,
  upload.single("profileImage"),
  editProfile
);

export default userRouter;
