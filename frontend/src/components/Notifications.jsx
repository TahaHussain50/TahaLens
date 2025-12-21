import React, { useEffect } from "react";
import axios from "axios";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./NotificationCard";
import { serverUrl } from "../App";
import { setNotificationData } from "../redux/userSlice";

function Notifications() {
  const { notificationData } = useSelector((state) => state.user);
  const ids = notificationData?.map((n) => n._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const markAsRead = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/markAsRead`,
        { notificationId: ids },
        { withCredentials: true }
      );
      await fetchNotifications();
    } catch (error) {}
  };
  const fetchNotifications = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getAllNotifications`,
        { withCredentials: true }
      );
      dispatch(setNotificationData(result.data));
    } catch (error) {}
  };

  useEffect(() => {
    markAsRead();
  }, []);
  return (
    <div className="w-full h-[100vh] bg-black">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden">
        <MdOutlineKeyboardBackspace
          className="text-white w-[25px] h-[25px] cursor-pointer"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Notifications</h1>
      </div>

      <div className="w-full h-[85vh] flex flex-col overflow-auto gap-[20px] px-[10px]">
        {notificationData && notificationData.length > 0 ? (
          notificationData.map((noti, index) => (
            <NotificationCard noti={noti} key={noti._id || index} />
          ))
        ) : (
          <div className="text-white text-center mt-[50px]">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
