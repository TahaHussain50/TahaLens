import React, { useEffect, useRef, useState } from "react";
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";
import dp from "../assets/dp.webp";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import axios from "axios";
import { serverUrl } from "../App";
import { setVideoData } from "../redux/videoSlice";
import { MdOutlineComment } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import usePrevChatUsers from "../hooks/usePrevChatUsers";

function VideoCard({ video }) {
  const { userData } = useSelector((state) => state.user);
  const { videoData } = useSelector((state) => state.video);
  const { socket } = useSelector((state) => state.socket);
  const videoRef = useRef();
  const [mute, setMute] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const lastTapRef = useRef(0);
  const heartTimeoutRef = useRef(null);
  const commentRef = useRef();
  const [message, setMessage] = useState("");

  const fetchPrevChats = usePrevChatUsers();

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/video/like/${video._id}`,
        { withCredentials: true }
      );
      const updatedVideo = result.data;

      const updatedVideos = videoData.map((p) =>
        p._id === video._id ? updatedVideo : p
      );
      dispatch(setVideoData(updatedVideos));
    } catch (error) {}
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/video/comment/${video._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedVideo = result.data;

      const updatedVideos = videoData.map((p) =>
        p._id === video._id ? updatedVideo : p
      );
      dispatch(setVideoData(updatedVideos));
      setMessage("");
    } catch (error) {}
  };

  const handleLikeOnDoubleClick = (e) => {
    if (e.type === "touchend") {
      e.preventDefault();
    }

    setShowHeart(true);

    if (heartTimeoutRef.current) {
      clearTimeout(heartTimeoutRef.current);
    }

    heartTimeoutRef.current = setTimeout(() => {
      setShowHeart(false);
    }, 2000);

    if (!video.likes.includes(userData._id)) {
      handleLike();
    }
  };
  const handleTouchEnd = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;

    if (tapLength < 300 && tapLength > 0) {
      handleLikeOnDoubleClick(e);
    }

    lastTapRef.current = currentTime;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    };

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showComment]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    socket?.on("likedVideo", (updatedData) => {
      const updatedVideo = videoData.map((p) =>
        p._id === updatedData.videoId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setVideoData(updatedVideo));
    });
    socket?.on("commentsVideo", (updatedData) => {
      const updatedVideo = videoData.map((p) =>
        p._id === updatedData.videoId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setVideoData(updatedVideo));
    });

    return () => {
      socket?.off("likedVideo");
      socket?.off("commentsVideo");
    };
  }, [socket, videoData, dispatch]);
  return (
    <div className="w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden">
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50 pointer-events-none">
          <GoHeartFill className="w-[100px] h-[100px] cursor-pointer text-red-600 drop-shadow-2xl" />
        </div>
      )}

      <div
        ref={commentRef}
        className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] transition-transform duration-500 ease-in-out shadow-2xl shadow-black left-0 ${
          showComment ? "translate-y-0" : "translate-y-[100%]"
        }`}
      >
        <h1 className="text-white text-[20px] text-center font-semibold">
          Comments
        </h1>

        <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]">
          {video.comments.length == 0 && (
            <div className="text-center text-white text-[20px] font-semibold mt-[50px]">
              No Comments Yet
            </div>
          )}
          {video.comments?.map((com, index) => (
            <div
              key={index}
              className="w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[3px]"
            >
              <div className="flex justify-start items-center gap-[10px] md:gap-[20px]">
                <div className="w-[40px] h-[40px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                  <img
                    src={com.author.profileImage || dp}
                    alt=""
                    className="w-full object-cover"
                    onClick={() => navigate(`/profile/${com.author.userName}`)}
                  />
                </div>
                <div className="flex flex-col gap-[5px] text-white">
                  <span
                    className="font-semibold text-[15px] cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile/${com.author.userName}`)}
                  >
                    {com.author.userName}
                  </span>
                  <span className="text-[14px]">{com.message}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[5px] py-[20px]">
          <div className="w-[40px] h-[40px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={userData.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <input
            type="text"
            className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px] text-white placeholder:text-white"
            placeholder="Write Comment..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          {message && (
            <button
              className="absolute right-[20px] cursor-pointer"
              onClick={handleComment}
            >
              <IoSendSharp className="w-[25px] h-[25px] text-white" />
            </button>
          )}
        </div>
      </div>
      <video
        ref={videoRef}
        src={video?.media}
        autoPlay
        loop
        muted={mute}
        className="w-full max-h-full"
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
        onTouchEnd={handleTouchEnd}
      ></video>
      <div
        className="absolute top-[20px] right-[20px] z-[100]"
        onClick={() => setMute((prev) => !prev)}
      >
        {!mute ? (
          <FiVolume2 className="w-[20px] h-[20px] text-white font-semibold" />
        ) : (
          <FiVolumeX className="w-[20px] h-[20px] text-white font-semibold" />
        )}
      </div>
      <div className="absolute bottom-0 w-full h-[5px] bg-gray-900">
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-[10px] md:gap-[20px]">
          <div
            className="w-[50px] h-[50px] md:w-[50px] md:h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/profile/${video.author.userName}`)}
          >
            <img
              src={video?.author?.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div
            className="w-[70px] font-semibold truncate cursor-pointer hover:underline text-white"
            onClick={() => navigate(`/profile/${video.author.userName}`)}
          >
            {video.author.userName}
          </div>
          {userData._id != video.author._id && (
            <FollowButton
              targetUserId={video.author?._id}
              tailwind={
                "px-[10px] py-[5px] text-white border-2 border-white text-[14px] rounded-2xl border-white cursor-pointer"
              }
              onFollowChange={fetchPrevChats}
            />
          )}
        </div>
        <div className="text-white px-[10px]">{video.caption}</div>
        <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px]">
          <div className="flex flex-col items-center">
            <div>
              {!video.likes.includes(userData._id) && (
                <GoHeart
                  className="w-[25px] h-[25px] cursor-pointer"
                  onClick={handleLike}
                />
              )}
              {video.likes.includes(userData._id) && (
                <GoHeartFill
                  className="w-[25px] h-[25px] cursor-pointer text-red-600"
                  onClick={handleLike}
                />
              )}
            </div>
            <div>{video.likes.length}</div>
          </div>
          <div className="flex flex-col items-center">
            <div>
              <MdOutlineComment
                className="w-[25px] h-[25px] cursor-pointer"
                onClick={() => setShowComment(true)}
              />
            </div>
            <div>{video.comments.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
