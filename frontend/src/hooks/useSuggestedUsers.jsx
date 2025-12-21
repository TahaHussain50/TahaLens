import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setSuggestedUsers } from "../redux/userSlice";

function useSuggestedUsers() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/suggested`, {
          withCredentials: true,
        });
        dispatch(setSuggestedUsers(result.data));
      } catch (error) {}
    };
    fetchUser();
  }, [userData]);
}

export default useSuggestedUsers;
