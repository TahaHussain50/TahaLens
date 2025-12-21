import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: null,
    storyList: null,
    currentUserStory: null,
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },
    setStoryList: (state, action) => {
      state.storyList = action.payload;
    },
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;
    },
    addNewStory: (state, action) => {
      if (!state.storyList) {
        state.storyList = [action.payload];
      } else {
        const exists = state.storyList.some(
          (s) => s._id === action.payload._id
        );
        if (!exists) {
          state.storyList.unshift(action.payload);
        }
      }
    },
  },
});

export const { setStoryData, setStoryList, setCurrentUserStory, addNewStory } =
  storySlice.actions;
export default storySlice.reducer;
