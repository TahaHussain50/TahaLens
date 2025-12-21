import User from "../models/user.js";
import Video from "../models/video.js";
import uploadOnCloudinary from "../config/cloudniary.js";
import { getSocketId, io } from "../socket.js";
import Notification from "../models/notification.js";

export const uploadVideo = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media Is Required" });
    }
    const video = await Video.create({ caption, media, author: req.userId });
    const user = await User.findById(req.userId);
    user.videos.push(video._id);
    await user.save();
    const populatedVideo = await Video.findById(video._id).populate(
      "author",
      "name userName profileImage"
    );

    io.emit("newVideo", populatedVideo);

    return res.status(201).json(populatedVideo);
  } catch (error) {
    return res.status(500).json({ message: `Upload Video Error ${error}` });
  }
};

export const like = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video Not Found" });
    }
    const alreadyLiked = video.likes.some(
      (id) => id.toString() == req.userId.toString()
    );
    if (alreadyLiked) {
      video.likes = video.likes.filter(
        (id) => id.toString() != req.userId.toString()
      );
    } else {
      video.likes.push(req.userId);
      if (video.author._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: video.author._id,
          type: "like",
          message: "liked your video",
          video: video._id,
        });
        const populatedNotification = await Notification.findById(
          notification._id
        ).populate("sender receiver video");
        const receiverSocketId = getSocketId(video.author._id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
      }
    }
    await video.save();
    await video.populate("author", "name userName profileImage");
    await video.populate({
      path: "comments.author",
      select: "userName profileImage",
    });
    io.emit("likedVideo", {
      videoId: video._id,
      likes: video.likes,
    });
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: `Like Video Error ${error}` });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video Not Found" });
    }
    video.comments.unshift({ author: req.userId, message });
    if (video.author._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: video.author._id,
        type: "comment",
        message: "commented on your video",
        video: video._id,
      });
      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender receiver video");
      const receiverSocketId = getSocketId(video.author._id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }
    await video.save();
    await video.populate("author", "name userName profileImage"),
      await video.populate("comments.author");
    io.emit("commentsVideo", {
      videoId: video._id,
      comments: video.comments,
    });
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: `Comments Video Error ${error}` });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .populate("author", "name userName profileImage caption")
      .populate("comments.author")
      .sort({ createdAt: -1 });
    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: `Get All Video Error ${error}` });
  }
};
