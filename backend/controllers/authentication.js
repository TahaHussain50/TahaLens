import sendMail from "../config/Mail.js";
import genToken from "../config/token.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    let errors = {};
    if (!name) {
      return res.status(400).json({ message: "Name is required!" });
    }
    if (!userName) {
      return res.status(400).json({ message: "Username is required!" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required!" });
    }
    const findByUserName = await User.findOne({ userName });
    if (findByUserName) {
      return res.status(400).json({ message: "User Name Already Exist !" });
    }
    const findByEmail = await User.findOne({ email });
    if (findByEmail) {
      return res.status(400).json({ message: "Email Already Exist !" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password Must Be Atleast 8 Characters !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `SignUp Error ${error}` });
  }
};

export const logIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User Not Found !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password !" });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Login Error ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: `Logout Error ${error}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 3 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);
    return res.status(200).json({ message: "Email Successfully Send" });
  } catch (error) {
    return res.status(500).json({ message: `Send OTP Error ${error}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid / Expired OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    return res.status(500).json({ message: `Verify OTP Error ${error}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP Verification Required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password Must Be Atleast 8 Characters !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ message: "Passwors Reset Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Reset OTP Error ${error}` });
  }
};
