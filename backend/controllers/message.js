import uploadOnCloudinary from "../config/cloudniary.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { getSocketId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: `Send Message Error ${error}` });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    return res.status(200).json(conversation?.messages);
  } catch (error) {
    return res.status(500).json({ message: `Get Message Error ${error}` });
  }
};

export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const user = await User.findById(currentUserId).select("following");

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants")
      .sort({ updatedAt: -1 });

    const userMap = {};
    conversations.forEach((conv) => {
      conv.participants.forEach((u) => {
        if (
          u._id.toString() !== currentUserId &&
          user.following.includes(u._id.toString())
        ) {
          userMap[u._id] = u;
        }
      });
    });

    const previousUsers = Object.values(userMap);

    return res.status(200).json(previousUsers);
  } catch (error) {
    return res.status(500).json({ message: `Previous User Error ${error}` });
  }
};
