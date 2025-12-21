import uploadOnCloudinary from "../config/cloudniary.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import { getSocketId, io } from "../socket.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "posts videos posts.author posts.comments story following"
    );
    if (!user) {
      return res.status(400).json({ message: "User Not Found !" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get Current User Error ! ${error}` });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get Suggested Users Error ! ${error}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, profession, gender } = req.body;
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const sameUserWithUserName = await User.findOne({ userName }).select(
      "-password"
    );
    if (sameUserWithUserName && sameUserWithUserName._id != req.userId) {
      return res.status(400).json({ message: "User Name Already Exist !" });
    }

    let profileImage;
    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
    }

    user.name = name;
    user.userName = userName;
    if (profileImage) {
      user.profileImage = profileImage;
    }
    user.bio = bio;
    user.profession = profession;
    user.gender = gender;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Edit Profile Error ! ${error}` });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ userName })
      .select("-password")
      .populate("posts videos followers following profileImage");
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Get Profile Error ! ${error}` });
  }
};

export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetUserId;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target User Is Not Found" });
    }

    if (currentUserId == targetUserId) {
      return res.status(400).json({ message: "You Can Not Follow Yourself." });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() != targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() != currentUserId
      );
      await currentUser.save();
      await targetUser.save();
      return res
        .status(200)
        .json({ following: false, message: "Unfollow Successfully" });
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      if (currentUser._id != targetUser._id) {
        const notification = await Notification.create({
          sender: currentUser._id,
          receiver: targetUser._id,
          type: "follow",
          message: "started following you",
        });
        const populatedNotification = await Notification.findById(
          notification._id
        ).populate("sender receiver");
        const receiverSocketId = getSocketId(targetUser._id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
      }
      await currentUser.save();
      await targetUser.save();
      return res
        .status(200)
        .json({ following: true, message: "Follow Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Follow Error ! ${error}` });
  }
};

export const followingList = async (req, res) => {
  try {
    const result = await User.findById(req.userId);
    return res.status(200).json(result?.following);
  } catch (error) {
    return res.status(500).json({ message: `Following Error ! ${error}` });
  }
};

export const search = async (req, res) => {
  try {
    const keyWord = req.query.keyWord;
    if (!keyWord) {
      return res.status(400).json({ message: "Keyword Is Required" });
    }

    const users = await User.find({
      $or: [
        { userName: { $regex: keyWord, $options: "i" } },
        { name: { $regex: keyWord, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `Search Error ! ${error}` });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.userId,
    })
      .populate("sender", "userName profileImage")
      .populate("receiver", "userName profileImage")
      .populate("post", "media mediaType")
      .populate("video", "media")
      .sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get Notification Error ! ${error}` });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (Array.isArray(notificationId)) {
      await Notification.updateMany(
        { _id: { $in: notificationId }, receiver: req.userId },
        { $set: { isRead: true } }
      );
    } else {
      await Notification.findOneAndUpdate(
        { _id: notificationId, receiver: req.userId },
        { $set: { isRead: true } }
      );
    }
    return res.status(200).json({ message: "marked as read" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Read Notification Error ! ${error}` });
  }
};
