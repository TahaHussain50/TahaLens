import React from "react";
import dp from "../assets/dp.webp";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";
import usePrevChatUsers from "../hooks/usePrevChatUsers";

function OtherUser({ user }) {
  const fetchPrevChats = usePrevChatUsers();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFollowChange = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/suggested`, {
        withCredentials: true,
      });
      dispatch(setSuggestedUsers(result.data));
    } catch (error) {}
  };
  return (
    <>
      <div className="w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/profile/${user.userName}`)}
          >
            <img
              src={user.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div>
            <div
              className="text-[18px] text-white font-semibold hover:underline cursor-pointer"
              onClick={() => navigate(`/profile/${user.userName}`)}
            >
              {user.userName}
            </div>
            <div className="text-[15px] text-gray-400 font-semibold">
              {user.name}
            </div>
          </div>
        </div>
        <FollowButton
          tailwind={
            "px-[10px] w-[100px] py-[5px] h-[40px] bg-white rounded-2xl cursor-pointer"
          }
          targetUserId={user._id}
          onFollowChange={fetchPrevChats}
        />
      </div>
    </>
  );
}

export default OtherUser;
