import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: `${process.env.EMAIL}`,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP For Password Reset Is <b>${otp}</b>.It Expire In 3 Minutes.</p>`,
  });
};

export default sendMail;
