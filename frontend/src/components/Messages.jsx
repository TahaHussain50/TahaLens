import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import OnlineUser from "./OnlineUser";
import { setSelectedUser, resetUnreadMessage } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers, unreadMessages } = useSelector(
    (state) => state.message
  );

  const [visibleOnlineUsers, setVisibleOnlineUsers] = useState([]);

  useEffect(() => {
    if (
      onlineUsers &&
      Array.isArray(onlineUsers) &&
      Array.isArray(userData?.following)
    ) {
      const filtered = userData.following.filter((user) =>
        onlineUsers.includes(user._id)
      );
      setVisibleOnlineUsers(filtered);
    } else {
      setVisibleOnlineUsers([]);
    }
  }, [onlineUsers, userData?.following]);

  const totalUnread = Object.values(unreadMessages || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] relative">
        <MdOutlineKeyboardBackspace
          className="text-white lg:hidden w-[25px] h-[25px] cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Messages</h1>

        {totalUnread > 0 && (
          <div className="hidden lg:flex absolute right-[20px] top-1/2 -translate-y-1/2 bg-red-600 text-white text-[12px] font-semibold rounded-full w-[24px] h-[24px] items-center justify-center">
            {totalUnread > 99 ? "99+" : totalUnread}
          </div>
        )}
      </div>

      <div className="w-full h-[80px] flex gap-[20px] items-center overflow-x-auto p-[20px] border-b-2 border-gray-800">
        {visibleOnlineUsers.length > 0 ? (
          visibleOnlineUsers.map((user) => (
            <OnlineUser user={user} key={user._id} />
          ))
        ) : (
          <div className="text-gray-500 text-[14px]">No friends online</div>
        )}
      </div>

      <div className="w-full flex-1 overflow-auto flex flex-col gap-[20px]">
        {prevChatUsers?.map((user) => (
          <div
            key={user._id}
            className="text-white cursor-pointer w-full flex items-center gap-[10px]"
            onClick={() => {
              dispatch(setSelectedUser(user));
              dispatch(resetUnreadMessage(user._id));
              navigate("/messageArea");
            }}
          >
            {onlineUsers?.includes(user._id) ? (
              <OnlineUser user={user} />
            ) : (
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                <img
                  src={user.profileImage || dp}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col flex-1">
              <div className="text-white text-[18px] font-semibold">
                {user.userName}
              </div>
              {onlineUsers?.includes(user._id) && (
                <div className="text-blue-500 text-[14px]">Active Now</div>
              )}
            </div>

            {unreadMessages?.[user._id] > 0 && (
              <div className="bg-red-600 text-white text-[12px] font-bold rounded-full min-w-[24px] h-[24px] flex items-center justify-center px-[6px]">
                {unreadMessages[user?._id] > 99
                  ? "99+"
                  : unreadMessages[user?._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
