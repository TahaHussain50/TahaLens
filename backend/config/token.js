import jwt from "jsonwebtoken";
const genToken = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    return res.status(500).json(`Gen Token Error ${error}`);
  }
};

export default genToken;
