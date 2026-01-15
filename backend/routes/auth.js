import express from "express";
import dbConnect from "../middlewares/dbConnect.js";
import {
  logIn,
  logOut,
  resetPassword,
  sendOtp,
  signUp,
  verifyOtp,
} from "../controllers/authentication.js";

const authRouter = express.Router();

authRouter.post("/signup", dbConnect, signUp);
authRouter.post("/login", dbConnect, logIn);
authRouter.post("/sendOtp", dbConnect, sendOtp);
authRouter.post("/verifyOtp", dbConnect, verifyOtp);
authRouter.post("/resetPassword", dbConnect, resetPassword);
authRouter.get("/logout", logOut);

export default authRouter;
