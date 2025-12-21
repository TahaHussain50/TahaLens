import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData, setUserData } from "../redux/userSlice";
import { setPostData } from "../redux/postSlice";

function useAllNotifications() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/getAllNotifications`,
          { withCredentials: true }
        );
        dispatch(setNotificationData(result.data));
      } catch (error) {}
    };
    fetchNotifications();
  }, [dispatch, userData]);
}

export default useAllNotifications;
