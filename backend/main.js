import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import videoRouter from "./routes/video.js";
import storyRouter from "./routes/story.js";
import messageRouter from "./routes/message.js";
import { app, server } from "./socket.js";
dotenv.config();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/video", videoRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`);
});
