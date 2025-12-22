import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,
    });
    console.log("Database Connected...");
  } catch (error) {
    console.log("Database Error Not Connected!!!");
  }
};

export default connectDB;
