import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import { upload } from "../middlewares/multer.js";
import {
  getAllMessages,
  getPrevUserChats,
  sendMessage,
} from "../controllers/message.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiverId",
  checkLogin,
  upload.single("image"),
  sendMessage
);
messageRouter.get("/getAll/:receiverId", checkLogin, getAllMessages);
messageRouter.get("/prevChats", checkLogin, getPrevUserChats);

export default messageRouter;
