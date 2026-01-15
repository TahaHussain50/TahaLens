import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import dbConnect from "../middlewares/dbConnect.js";
import { upload } from "../middlewares/multer.js";
import {
  comment,
  getAllPosts,
  like,
  saved,
  uploadPost,
} from "../controllers/post.js";

const postRouter = express.Router();

postRouter.post(
  "/upload",
  dbConnect,
  checkLogin,
  upload.single("media"),
  uploadPost
);

postRouter.get("/getAll", dbConnect, checkLogin, getAllPosts);
postRouter.get("/like/:postId", dbConnect, checkLogin, like);
postRouter.get("/saved/:postId", dbConnect, checkLogin, saved);
postRouter.post("/comment/:postId", dbConnect, checkLogin, comment);

export default postRouter;
