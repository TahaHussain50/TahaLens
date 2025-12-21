import axios from "axios";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setPrevChatUsers } from "../redux/messageSlice";

function usePrevChatUsers() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const fetchPrevChatUsers = useCallback(async () => {
    if (!userData?._id) return;

    try {
      const result = await axios.get(`${serverUrl}/api/message/prevChats`, {
        withCredentials: true,
      });
      dispatch(setPrevChatUsers(result.data));
    } catch (error) {}
  }, [userData?._id, dispatch]);

  return fetchPrevChatUsers;
}

export default usePrevChatUsers;
