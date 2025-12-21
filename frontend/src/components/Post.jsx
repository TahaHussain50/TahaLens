import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineComment } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";
import FollowButton from "./FollowButton";
import usePrevChatUsers from "../hooks/usePrevChatUsers";

function Post({ post }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);
  const [showComment, setShowComment] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const fetchPrevChats = usePrevChatUsers();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = result.data;

      const updatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {}
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedPost = result.data;

      const updatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {}
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (error) {}
  };

  const displayedComments = showAllComments
    ? post.comments
    : post.comments?.slice(0, 2);

  const hasMoreComments = post.comments?.length > 2;

  useEffect(() => {
    socket?.on("likedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setPostData(updatedPosts));
    });
    socket?.on("commentsPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      socket?.off("likedPost");
      socket?.off("commentsPost");
    };
  }, [socket, postData, dispatch]);
  return (
    <div className="w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[0_0_60px_rgba(255,255,255,0.4)] rounded-2xl pb-[20px]">
      <div className="w-full h-[80px] flex justify-between items-center px-[10px]">
        <div className="flex justify-center items-center gap-[10px] md:gap-[20px]">
          <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={post?.author?.profileImage || dp}
              alt=""
              className="w-full object-cover"
              onClick={() => navigate(`/profile/${post?.author?.userName}`)}
            />
          </div>
          <div
            className="w-[100px] font-semibold truncate cursor-pointer hover:underline"
            onClick={() => navigate(`/profile/${post?.author?.userName}`)}
          >
            {post.author.userName}
          </div>
        </div>
        {userData._id != post.author._id && (
          <FollowButton
            tailwind={
              "px-[10px] min-w-[70px] md:min-w-[100px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px] cursor-pointer"
            }
            targetUserId={post.author._id}
            onFollowChange={fetchPrevChats}
          />
        )}
      </div>
      <div className="w-[90%] flex items-center justify-center">
        {post.mediaType == "image" && (
          <div className="w-[90%] flex items-center justify-center">
            <img
              src={post.media}
              alt=""
              className="w-[80%] object-cover rounded-2xl"
            />
          </div>
        )}

        {post.mediaType == "video" && (
          <div className="w-[70%] md:w-[50%] flex flex-col items-center justify-center">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      <div className="w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]">
        <div className="flex justify-center items-center gap-[10px]">
          <div className="flex justify-center items-center gap-[5px]">
            {!post.likes.includes(userData._id) && (
              <GoHeart
                className="w-[25px] h-[25px] cursor-pointer"
                onClick={handleLike}
              />
            )}
            {post.likes.includes(userData._id) && (
              <GoHeartFill
                className="w-[25px] h-[25px] cursor-pointer text-red-600"
                onClick={handleLike}
              />
            )}
            <span>{post.likes.length}</span>
          </div>
          <div
            className="flex justify-center items-center gap-[5px]"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <MdOutlineComment className="w-[25px] h-[25px] cursor-pointer" />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div onClick={handleSaved}>
          {!userData.saved.includes(post?._id) && (
            <MdOutlineBookmarkBorder className="w-[25px] h-[25px] cursor-pointer" />
          )}
          {userData.saved.includes(post?._id) && (
            <GoBookmarkFill className="w-[25px] h-[25px] cursor-pointer text-black-600" />
          )}
        </div>
      </div>

      {post.caption && (
        <div className="w-full px-[20px] gap-[10px] flex justify-start items-center">
          <h1>{post.author.userName}</h1>
          <div>{post.caption}</div>
        </div>
      )}

      <div className="w-full flex flex-col gap-[10px] pb-[20px]">
        <div className="w-full h-[80px] flex items-center justify-between px-[20px] relative">
          <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={userData.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <input
            type="text"
            className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]"
            placeholder="Write Comment..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            className="absolute right-[20px] cursor-pointer"
            onClick={handleComment}
          >
            <IoSendSharp className="w-[25px] h-[25px]" />
          </button>
        </div>

        {showComment && (
          <div className="w-full flex flex-col">
            <div className="w-full">
              {displayedComments?.map((com, index) => (
                <div
                  key={index}
                  className="w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200"
                >
                  <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                    <img
                      src={com.author.profileImage || dp}
                      alt=""
                      className="w-full object-cover"
                      onClick={() =>
                        navigate(`/profile/${com.author.userName}`)
                      }
                    />
                  </div>
                  <div className="flex gap-[5px]">
                    <span
                      className="font-semibold text-[15px] cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/profile/${com.author.userName}`)
                      }
                    >
                      {com.author.userName}
                    </span>
                    <span className="text-[14px]">{com.message}</span>
                  </div>
                </div>
              ))}
            </div>

            {hasMoreComments && (
              <div className="w-full px-[20px] py-[10px]">
                <button
                  onClick={() => setShowAllComments((prev) => !prev)}
                  className="text-blue-500 font-semibold text-[14px] hover:text-gray-700 cursor-pointer"
                >
                  {showAllComments
                    ? "Show less"
                    : `View all ${post.comments.length} comments`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
