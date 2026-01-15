import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import dbConnect from "../middlewares/dbConnect.js";
import { upload } from "../middlewares/multer.js";
import {
  getAllMessages,
  getPrevUserChats,
  sendMessage,
} from "../controllers/message.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiverId",
  dbConnect,
  checkLogin,
  upload.single("image"),
  sendMessage
);

messageRouter.get(
  "/getAll/:receiverId",
  dbConnect,
  checkLogin,
  getAllMessages
);

messageRouter.get(
  "/prevChats",
  dbConnect,
  checkLogin,
  getPrevUserChats
);

export default messageRouter;
