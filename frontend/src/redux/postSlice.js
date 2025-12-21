import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    postData: [],
  },
  reducers: {
    setPostData: (state, action) => {
      state.postData = action.payload;
    },
    addNewPost: (state, action) => {
      const exists = state.postData.some(
        (post) => post._id === action.payload._id
      );
      if (!exists) {
        state.postData.unshift(action.payload);
      }
    },
  },
});

export const { setPostData, addNewPost } = postSlice.actions;
export default postSlice.reducer;
