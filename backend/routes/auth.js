import express from "express";
import connectDB from "../config/database.js";
import {
  logIn,
  logOut,
  resetPassword,
  sendOtp,
  signUp,
  verifyOtp,
} from "../controllers/authentication.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  await connectDB();
  next();
}, signUp);

authRouter.post("/login", async (req, res, next) => {
  await connectDB();
  next();
}, logIn);

authRouter.post("/sendOtp", async (req, res, next) => {
  await connectDB();
  next();
}, sendOtp);

authRouter.post("/verifyOtp", async (req, res, next) => {
  await connectDB();
  next();
}, verifyOtp);

authRouter.post("/resetPassword", async (req, res, next) => {
  await connectDB();
  next();
}, resetPassword);

authRouter.get("/logout", logOut);

export default authRouter;
