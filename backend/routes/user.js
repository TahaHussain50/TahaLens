import express from "express";
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

userRouter.get("/current", checkLogin, getCurrentUser);
userRouter.get("/suggested", checkLogin, suggestedUsers);
userRouter.get("/getProfile/:userName", checkLogin, getProfile);
userRouter.get("/follow/:targetUserId", checkLogin, follow);
userRouter.get("/followingList", checkLogin, followingList);
userRouter.get("/search", checkLogin, search);
userRouter.get("/getAllNotifications", checkLogin, getAllNotifications);
userRouter.post("/markAsRead", checkLogin, markAsRead);
userRouter.post(
  "/editProfile",
  checkLogin,
  upload.single("profileImage"),
  editProfile
);

export default userRouter;
