import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import StoryCard from "./StoryCard";

function Story() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);
  const handleStory = async () => {
    dispatch(setStoryData(null));
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getByUserName/${userName}`,
        { withCredentials: true }
      );
      dispatch(setStoryData(result.data[0]));
    } catch (error) {}
  };
  useEffect(() => {
    if (userName) {
      handleStory();
    }
  }, [userName]);
  return (
    <div className="w-full h-[100vh] bg-black flex justify-center items-center">
      <StoryCard storyData={storyData} />
    </div>
  );
}

export default Story;
