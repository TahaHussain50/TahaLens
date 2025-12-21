import express from "express";
import {
  logIn,
  logOut,
  resetPassword,
  sendOtp,
  signUp,
  verifyOtp,
} from "../controllers/authentication.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.post("/sendOtp", sendOtp);
authRouter.post("/verifyOtp", verifyOtp);
authRouter.post("/resetPassword", resetPassword);
authRouter.get("/logout", logOut);

export default authRouter;
