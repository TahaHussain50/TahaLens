import mongoose from "mongoose";
const videoSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema, "user_video_data");
export default Video;
