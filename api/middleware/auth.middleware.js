import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";  // ✅ Import User model

dotenv.config();

const verify_jwt = async (req, res, next) => {
  try {
    const token = req.cookies?.session; 
    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw new ApiError(401, "Invalid token");
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new ApiError(401, "User not found for this token");
    }

    req.user = user; 
    next(); 
  } catch (error) {
    console.log("Error in verify token:", error);
    res.status(401).json({ message: "Token expired or invalid, please login again" });
  }
};

export default verify_jwt;
