import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import { upload } from "../middlewares/multer.js";
import {
  comment,
  getAllVideos,
  like,
  uploadVideo,
} from "../controllers/video.js";

const videoRouter = express.Router();

videoRouter.post("/upload", checkLogin, upload.single("media"), uploadVideo);
videoRouter.get("/getAll", checkLogin, getAllVideos);
videoRouter.get("/like/:videoId", checkLogin, like);
videoRouter.post("/comment/:videoId", checkLogin, comment);

export default videoRouter;
