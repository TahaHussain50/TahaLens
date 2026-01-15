import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import dbConnect from "../middlewares/dbConnect.js";
import { upload } from "../middlewares/multer.js";
import {
  getAllStories,
  getStoryByUserName,
  uploadStory,
  viewStory,
} from "../controllers/story.js";

const storyRouter = express.Router();

storyRouter.post(
  "/upload",
  dbConnect,
  checkLogin,
  upload.single("media"),
  uploadStory
);

storyRouter.get(
  "/getByUserName/:userName",
  dbConnect,
  checkLogin,
  getStoryByUserName
);

storyRouter.get("/getAll", dbConnect, checkLogin, getAllStories);
storyRouter.get("/view/:storyId", dbConnect, checkLogin, viewStory);

export default storyRouter;
