import React, { useEffect } from "react";
import logo from "../assets/2.png";
import { FaRegHeart } from "react-icons/fa6";
import { BiMessageAltDetail } from "react-icons/bi";
import StoryDp from "./StoryDp";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setStoryList } from "../redux/storySlice";

function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData, notificationData, following } = useSelector(
    (state) => state.user
  );
  const { storyList, currentUserStory } = useSelector((state) => state.story);
  const { unreadMessages } = useSelector((state) => state.message);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalUnread = Object.values(unreadMessages).reduce(
    (sum, count) => sum + count,
    0
  );

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/story/getAll`, {
          withCredentials: true,
        });
        dispatch(setStoryList(result.data));
      } catch (error) {
        
      }
    };

    if (userData) {
      fetchStories();
    }
  }, [userData, following, dispatch]);
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full relative h-[100px] flex items-center justify-between p-[20px] lg:hidden">
        <img src={logo} alt="" className="w-[235px] absolute left-[-14px]" />
        <div className="flex items-center gap-[10px] absolute right-[30px] top-[50px]">
          <div className="relative" onClick={() => navigate("/notifications")}>
            <FaRegHeart className="text-white w-[25px] h-[25px]" />
            {notificationData?.length > 0 &&
              notificationData.some((noti) => noti.isRead === false) && (
                <div className="w-[10px] h-[10px] bg-red-600 rounded-full absolute top-0 right-[-5px]"></div>
              )}
          </div>

          <div className="relative" onClick={() => navigate("/messages")}>
            <BiMessageAltDetail className="text-white w-[25px] h-[25px]" />
            {totalUnread > 0 && (
              <div className="bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center absolute top-[-8px] right-[-8px] px-[4px]">
                {totalUnread > 99 ? "99+" : totalUnread}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full overflow-auto gap-[10px] items-center p-[20px]">
        <StoryDp
          userName={"Your Story"}
          ProfileImage={userData.profileImage}
          story={currentUserStory}
        />

        {storyList?.map((story, index) => (
          <StoryDp
            userName={story.author.userName}
            ProfileImage={story.author.profileImage}
            story={story}
            key={index}
          />
        ))}
      </div>

      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-black rounded-t-[60px] relative pb-[120px]">
        <Nav />

        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Feed;