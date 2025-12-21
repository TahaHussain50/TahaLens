import jwt from "jsonwebtoken";
const checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Token Is Not Found" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    return res.status(500).json({ message: `Is Login Error ${error}` });
  }
};
export default checkLogin;
