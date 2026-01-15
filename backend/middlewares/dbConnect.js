import connectDB from "../config/database.js";

const dbConnect = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({ message: "Database connection failed" });
  }
};

export default dbConnect;
