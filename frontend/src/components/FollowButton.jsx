import axios from "axios";
import React from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollow } from "../redux/userSlice";
import { setStoryList } from "../redux/storySlice";

function FollowButton({ targetUserId, tailwind, onFollowChange }) {
  const { following } = useSelector((state) => state.user);
  const { storyList } = useSelector((state) => state.story);
  const isFollowing = following.includes(targetUserId);
  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/follow/${targetUserId}`,
        { withCredentials: true }
      );

      dispatch(toggleFollow(targetUserId));

      if (!isFollowing) {
        const storyResponse = await axios.get(`${serverUrl}/api/story/getAll`, {
          withCredentials: true,
        });
        dispatch(setStoryList(storyResponse.data));
      } else {
        const updatedStories = storyList?.filter(
          (story) => story.author._id !== targetUserId
        );
        dispatch(setStoryList(updatedStories));
      }

      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      
    }
  };
  return (
    <button className={tailwind} onClick={handleFollow}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;