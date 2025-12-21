import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import { upload } from "../middlewares/multer.js";
import {
  comment,
  getAllPosts,
  like,
  saved,
  uploadPost,
} from "../controllers/post.js";

const postRouter = express.Router();

postRouter.post("/upload", checkLogin, upload.single("media"), uploadPost);
postRouter.get("/getAll", checkLogin, getAllPosts);
postRouter.get("/like/:postId", checkLogin, like);
postRouter.get("/saved/:postId", checkLogin, saved);
postRouter.post("/comment/:postId", checkLogin, comment);

export default postRouter;
