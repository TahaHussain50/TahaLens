import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import { useDispatch, useSelector } from "react-redux";
import useCurrentUser from "./hooks/useCurrentUser";
import useSuggestedUsers from "./hooks/useSuggestedUsers";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Upload from "./components/Upload";
import useAllPost from "./hooks/useAllPost";
import Videos from "./components/Videos";
import useAllVideos from "./hooks/useAllVideos";
import Story from "./components/Story";
import useAllStories from "./hooks/useAllStories";
import Messages from "./components/Messages";
import MessageArea from "./components/MessageArea";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import useFollowingList from "./hooks/useFollowingList";
import usePrevChatUsers from "./hooks/usePrevChatUsers";
import Search from "./components/Search";
import useAllNotifications from "./hooks/useAllNotifications";
import Notifications from "./components/Notifications";
import { setNotificationData } from "./redux/userSlice";
import { addNewStory } from "./redux/storySlice";
import { addNewPost } from "./redux/postSlice";
import { addNewVideo } from "./redux/videoSlice";
import { incrementUnreadMessage, moveUserToTop } from "./redux/messageSlice";
export const serverUrl = "https://taha-lens-backend.vercel.app";

function App() {
  useCurrentUser();
  useSuggestedUsers();
  useAllPost();
  useAllVideos();
  useAllStories();
  useFollowingList();
  const fetchPrevChats = usePrevChatUsers();
  useAllNotifications();
  const { userData, notificationData, following } = useSelector(
    (state) => state.user
  );
  const { socket } = useSelector((state) => state.socket);
  const { selectedUser } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData?._id || socket) {
      fetchPrevChats();
      const socketIo = io(serverUrl, {
        query: {
          userId: userData?._id,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      socketIo.on("connect", () => {
        dispatch(setSocket(socketIo));
      });

      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      socketIo.on("newStory", (story) => {
        dispatch(addNewStory(story));
      });

      socketIo.on("newPost", (post) => {
        dispatch(addNewPost(post));
      });

      socketIo.on("newVideo", (video) => {
        dispatch(addNewVideo(video));
      });

      socketIo.on("newNotification", (notification) => {
        dispatch(setNotificationData(notification));
      });

      socketIo.on("newMessage", (message) => {
        const senderId = message.sender;

        if (!selectedUser || selectedUser._id !== senderId) {
          dispatch(incrementUnreadMessage(senderId));
        }

        dispatch(moveUserToTop(senderId));
      });

      socketIo.on("disconnect", () => {});

      return () => {
        socketIo.off("newStory");
        socketIo.off("newPost");
        socketIo.off("newVideo");
        socketIo.off("connect");
        socketIo.off("getOnlineUsers");
        socketIo.off("newNotification");
        socketIo.off("newMessage");
        socketIo.off("disconnect");
        socketIo.close();
        dispatch(setSocket(null));
        dispatch(setOnlineUsers([]));
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
        dispatch(setOnlineUsers([]));
      }
    }
  }, [userData?._id]);

  return (
    <>
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!userData ? <LogIn /> : <Navigate to={"/"} />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile/:userName"
          element={userData ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/story/:userName"
          element={userData ? <Story /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/upload"
          element={userData ? <Upload /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/search"
          element={userData ? <Search /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/messages"
          element={userData ? <Messages /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/messageArea"
          element={userData ? <MessageArea /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/notifications"
          element={userData ? <Notifications /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/videos"
          element={userData ? <Videos /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;
