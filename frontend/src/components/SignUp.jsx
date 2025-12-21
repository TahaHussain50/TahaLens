import React, { useState } from "react";
import logo from "../assets/Adobe Express - file.png";
import logo1 from "../assets/2.png";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData, setFollowing } from "../redux/userSlice";
import { setStoryList } from "../redux/storySlice";

function SignUp() {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );
      const newUser = result.data;

      dispatch(setUserData(newUser));

      if (newUser.following) {
        dispatch(setFollowing(newUser.following));
      } else {
        dispatch(setFollowing([]));
      }

      try {
        const storyResponse = await axios.get(`${serverUrl}/api/story/getAll`, {
          withCredentials: true,
        });
        dispatch(setStoryList(storyResponse.data));
      } catch (storyError) {}

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErr(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center py-8 px-4">
        <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex flex-col lg:flex-row justify-center items-center overflow-hidden border-2 border-[#1a1f23] relative">
          <div className="w-full lg:w-[50%] h-full flex flex-col justify-center items-center p-[20px] gap-[20px]">
            <div className="w-full flex justify-center mb-6 lg:mb-8">
              <img
                src={logo}
                alt="TahaLens Logo"
                className="w-[400px] object-contain absolute top-[-50px]"
              />
            </div>

            <div className="w-full max-w-[400px] md:mt-[80px] mt-[30px] space-y-4 flex flex-col items-center">
              <div
                className="relative w-full h-[50px]"
                onClick={() => setInputClicked({ ...inputClicked, name: true })}
              >
                <label
                  htmlFor="name"
                  className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] transition-all duration-200 ${
                    inputClicked.name || name
                      ? "top-[-15px] text-[13px]"
                      : "top-[12px]"
                  }`}
                >
                  Enter Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full h-full rounded-2xl px-[20px] outline-none border-2 border-black"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  onFocus={() =>
                    setInputClicked({ ...inputClicked, name: true })
                  }
                  onBlur={() =>
                    !name && setInputClicked({ ...inputClicked, name: false })
                  }
                />
              </div>

              <div
                className="relative w-full h-[50px]"
                onClick={() =>
                  setInputClicked({ ...inputClicked, userName: true })
                }
              >
                <label
                  htmlFor="userName"
                  className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] transition-all duration-200 ${
                    inputClicked.userName || userName
                      ? "top-[-15px] text-[13px]"
                      : "top-[12px]"
                  }`}
                >
                  Enter User Name
                </label>
                <input
                  type="text"
                  id="userName"
                  className="w-full h-full rounded-2xl px-[20px] outline-none border-2 border-black"
                  required
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                  onFocus={() =>
                    setInputClicked({ ...inputClicked, userName: true })
                  }
                  onBlur={() =>
                    !userName &&
                    setInputClicked({ ...inputClicked, userName: false })
                  }
                />
              </div>

              <div
                className="relative w-full h-[50px]"
                onClick={() =>
                  setInputClicked({ ...inputClicked, email: true })
                }
              >
                <label
                  htmlFor="email"
                  className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] transition-all duration-200 ${
                    inputClicked.email || email
                      ? "top-[-15px] text-[13px]"
                      : "top-[12px]"
                  }`}
                >
                  Enter Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full h-full rounded-2xl px-[20px] outline-none border-2 border-black"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  onFocus={() =>
                    setInputClicked({ ...inputClicked, email: true })
                  }
                  onBlur={() =>
                    !email && setInputClicked({ ...inputClicked, email: false })
                  }
                />
              </div>

              <div
                className="relative w-full h-[50px]"
                onClick={() =>
                  setInputClicked({ ...inputClicked, password: true })
                }
              >
                <label
                  htmlFor="password"
                  className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] transition-all duration-200 ${
                    inputClicked.password || password
                      ? "top-[-15px] text-[13px]"
                      : "top-[12px]"
                  }`}
                >
                  Enter Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full h-full rounded-2xl px-[20px] outline-none border-2 border-black"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onFocus={() =>
                    setInputClicked({ ...inputClicked, password: true })
                  }
                  onBlur={() =>
                    !password &&
                    setInputClicked({ ...inputClicked, password: false })
                  }
                />
                {!showPassword ? (
                  <IoIosEyeOff
                    className="absolute cursor-pointer right-[20px] top-[12px] w-[25px] h-[25px]"
                    onClick={() => setShowPassword(true)}
                  />
                ) : (
                  <IoIosEye
                    className="absolute cursor-pointer right-[20px] top-[12px] w-[25px] h-[25px]"
                    onClick={() => setShowPassword(false)}
                  />
                )}
              </div>

              {err && <p className="text-red-500">{err}</p>}

              <button
                type="submit"
                className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-4"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
              </button>

              <p
                className="cursor-pointer text-gray-800 text-center"
                onClick={() => navigate("/login")}
              >
                Already Have An Account?{" "}
                <span className="border-b-2 border-b-black pb-[3px] text-black font-semibold">
                  Login
                </span>
              </p>
            </div>
          </div>

          <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
            <img src={logo1} alt="" className="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
