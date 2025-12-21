import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { setPostData } from "../redux/postSlice";
import { setVideoData } from "../redux/videoSlice";

function useAllVideos() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchvideos = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/video/getAll`, {
          withCredentials: true,
        });
        dispatch(setVideoData(result.data));
      } catch (error) {}
    };
    fetchvideos();
  }, [dispatch, userData]);
}

export default useAllVideos;
