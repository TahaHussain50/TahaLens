import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    videoData: [],
  },
  reducers: {
    setVideoData: (state, action) => {
      state.videoData = action.payload;
    },
    addNewVideo: (state, action) => {
      const exists = state.videoData.some(
        (video) => video._id === action.payload._id
      );
      if (!exists) {
        state.videoData.unshift(action.payload);
      }
    },
  },
});

export const { setVideoData, addNewVideo } = videoSlice.actions;
export default videoSlice.reducer;
