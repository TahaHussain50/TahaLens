import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    prevChatUsers: null,
    unreadMessages: {},
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      if (action.payload?._id) {
        state.unreadMessages[action.payload._id] = 0;
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload;
    },
    incrementUnreadMessage: (state, action) => {
      const userId = action.payload;
      state.unreadMessages[userId] = (state.unreadMessages[userId] || 0) + 1;
    },
    resetUnreadMessage: (state, action) => {
      const userId = action.payload;
      state.unreadMessages[userId] = 0;
    },
    moveUserToTop: (state, action) => {
      const userId = action.payload;
      const userIndex = state.prevChatUsers.findIndex((u) => u._id === userId);
      if (userIndex > 0) {
        const user = state.prevChatUsers[userIndex];
        state.prevChatUsers = [
          user,
          ...state.prevChatUsers.filter((_, i) => i !== userIndex),
        ];
      }
    },
  },
});

export const {
  setSelectedUser,
  setMessages,
  setPrevChatUsers,
  incrementUnreadMessage,
  resetUnreadMessage,
  moveUserToTop,
} = messageSlice.actions;
export default messageSlice.reducer;
