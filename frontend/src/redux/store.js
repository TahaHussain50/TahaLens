import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import storySlice from "./storySlice";
import videoSlice from "./videoSlice";
import messageSlice from "./messageSlice";
import socketSlice from "./socketSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    video: videoSlice,
    message: messageSlice,
    socket: socketSlice,
  },
});
