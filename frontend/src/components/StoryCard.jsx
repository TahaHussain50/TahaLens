import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from "./VideoPlayer";
import { IoIosEye } from "react-icons/io";

function StoryCard({ storyData }) {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });

      return () => clearInterval(interval);
    }, 150);
  }, [navigate]);
  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
      <div className="flex items-center gap-[10px] absolute top-[30px]">
        <MdOutlineKeyboardBackspace
          className="text-white w-[25px] h-[25px] cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div
          className="w-[50px] h-[50px] md:w-[50px] md:h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
          onClick={() => navigate(`/profile/${storyData.author.userName}`)}
        >
          <img
            src={storyData?.author?.profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div
          className="w-[70px] font-semibold truncate cursor-pointer hover:underline text-white"
          onClick={() => navigate(`/profile/${storyData.author.userName}`)}
        >
          {storyData?.author?.userName}
        </div>
      </div>

      <div className="absolute top-[10px] w-full h-[5px] bg-gray-900">
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {!showViewers && (
        <>
          <div className="w-full h-[90vh] flex items-center justify-center">
            {storyData?.mediaType == "image" && (
              <div className="w-[90%] flex items-center justify-center">
                <img
                  src={storyData.media}
                  alt=""
                  className="w-[80%] object-cover rounded-2xl"
                />
              </div>
            )}

            {storyData?.mediaType == "video" && (
              <div className="w-[70%] md:w-[50%] flex flex-col items-center justify-center">
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>

          {storyData?.author?.userName == userData?.userName && (
            <div
              className="absolute w-full h-[70px] bottom-0 p-2 left-0 text-white flex items-center gap-[10px] cursor-pointer"
              onClick={() => setShowViewers(true)}
            >
              <div className="text-white flex items-center gap-[5px]">
                <IoIosEye className="w-[25px] h-[25px] cursor-pointer" />
                {storyData.viewers.length}
              </div>
              <div className="flex relative">
                {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                  <div
                    className={`w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${
                      index > 0 ? `absolute left-[${index * 9}px]` : ""
                    }`}
                    key={index}
                    style={{
                      left: `${index * 15}px`,
                      zIndex: index,
                    }}
                  >
                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className="w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showViewers && (
        <>
          <div
            className="w-full h-[30%] flex items-center justify-center mt-[100px] overflow-hidden py-[30px] cursor-pointer"
            onClick={() => setShowViewers(false)}
          >
            {storyData?.mediaType == "image" && (
              <div className="h-full flex items-center justify-center">
                <img
                  src={storyData.media}
                  alt=""
                  className="h-full object-cover rounded-2xl"
                />
              </div>
            )}

            {storyData?.mediaType == "video" && (
              <div className="h-full flex flex-col items-center justify-center">
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>

          <div className="w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]">
            <div className="text-white flex items-center gap-[10px]">
              <IoIosEye />
              <span>{storyData?.viewers?.length}</span>
              <span>Viewers</span>
            </div>

            <div className="w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]">
              {storyData?.viewers?.map((viewer, index) => (
                <div
                  className="w-full flex items-center gap-[20px]"
                  key={index}
                >
                  <div
                    className="w-[50px] h-[50px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/profile/${viewer?.userName}`)}
                  >
                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className="w-full object-cover"
                    />
                  </div>
                  <div
                    className="w-[100px] font-semibold truncate cursor-pointer hover:underline text-white"
                    onClick={() => navigate(`/profile/${viewer?.userName}`)}
                  >
                    {viewer?.userName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StoryCard;
