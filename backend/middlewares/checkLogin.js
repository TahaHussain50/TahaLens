import jwt from "jsonwebtoken";

const checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default checkLogin;
