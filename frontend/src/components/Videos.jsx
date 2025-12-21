import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";

function Videos() {
  const navigate = useNavigate();
  const { videoData } = useSelector((state) => state.video);
  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]">
        <MdOutlineKeyboardBackspace
          className="text-white w-[25px] h-[25px] cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Videos</h1>
      </div>
      <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {videoData.map((video, index) => (
          <div className="h-screen snap-start" key={index}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Videos;
