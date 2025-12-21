import uploadOnCloudinary from "../config/cloudniary.js";
import Story from "../models/story.js";
import User from "../models/user.js";
import { io, getSocketId } from "../socket.js";

export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("followers");
    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }
    const { mediaType } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media Is Required" });
    }

    const story = await Story.create({ author: req.userId, mediaType, media });
    user.story = story._id;
    await user.save();
    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    user.followers.forEach((followerId) => {
      const socketId = getSocketId(followerId.toString());
      if (socketId) {
        io.to(socketId).emit("newStory", populatedStory);
      }
    });

    const uploaderSocket = getSocketId(req.userId.toString());
    if (uploaderSocket) {
      io.to(uploaderSocket).emit("newStory", populatedStory);
    }

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `Story Upload Error ${error}` });
  }
};

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(400).json({ message: "Story Not Found" });
    }

    if (story.author.toString() !== req.userId.toString()) {
      const viewersIds = story.viewers.map((id) => id.toString());
      if (!viewersIds.includes(req.userId.toString())) {
        story.viewers.push(req.userId);
        await story.save();
      }
    }

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `Story View Error ${error}` });
  }
};

export const getStoryByUserName = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const story = await Story.find({ author: user._id }).populate(
      "viewers author"
    );
    return res.status(200).json(story);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Story Get By User Name Error ${error}` });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const followingIds = currentUser.following;

    const stories = await Story.find({ author: { $in: followingIds } })
      .populate("viewers author")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: `All Story Get Error ${error}` });
  }
};
