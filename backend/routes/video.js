import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import dbConnect from "../middlewares/dbConnect.js";
import { upload } from "../middlewares/multer.js";
import {
  comment,
  getAllVideos,
  like,
  uploadVideo,
} from "../controllers/video.js";

const videoRouter = express.Router();

videoRouter.post(
  "/upload",
  dbConnect,
  checkLogin,
  upload.single("media"),
  uploadVideo
);

videoRouter.get("/getAll", dbConnect, checkLogin, getAllVideos);
videoRouter.get("/like/:videoId", dbConnect, checkLogin, like);
videoRouter.post("/comment/:videoId", dbConnect, checkLogin, comment);

export default videoRouter;
