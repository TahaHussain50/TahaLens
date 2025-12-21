import axios from "axios";
import React from "react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/userSlice";
import { useEffect } from "react";
import dp from "../assets/dp.webp";

function Search() {
  const { searchData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }

    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?keyWord=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {}
  };

  useEffect(() => {
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);
  return (
    <div className="w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] relative">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <MdOutlineKeyboardBackspace
          className="text-white w-[25px] h-[25px] cursor-pointer"
          onClick={() => navigate(`/`)}
        />
      </div>

      <div className="w-full h-[80px] flex items-center justify-center absolute top-[50px]">
        <form className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]">
          <FiSearch className="text-white w-[18px] h-[18px] cursor-pointer" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px]"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
      </div>

      <div className="w-full flex flex-col items-center mt-[60px] max-h-[calc(100vh-150px)] overflow-y-auto">
        {searchData?.map((user, index) => (
          <div
            key={index}
            className="w-[90vw] max-w-[700px] flex items-center gap-[15px] py-[15px] px-[10px] border-b border-gray-800 hover:bg-[#0f1414] transition-all duration-200 cursor-pointer"
            onClick={() => navigate(`/profile/${user.userName}`)}
          >
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0">
              <img
                src={user.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="text-white font-bold text-[16px] hover:underline truncate">
                {user.userName}
              </div>
              <div className="text-gray-500 text-[14px] truncate">
                {user.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
