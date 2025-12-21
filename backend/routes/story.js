import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import { upload } from "../middlewares/multer.js";
import {
  getAllStories,
  getStoryByUserName,
  uploadStory,
  viewStory,
} from "../controllers/story.js";

const storyRouter = express.Router();

storyRouter.post("/upload", checkLogin, upload.single("media"), uploadStory);
storyRouter.get("/getByUserName/:userName", checkLogin, getStoryByUserName);
storyRouter.get("/getAll", checkLogin, getAllStories);
storyRouter.get("/view/:storyId", checkLogin, viewStory);

export default storyRouter;
