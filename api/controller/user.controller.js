


import { User } from "../models/user.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Google_log_in = asyncHandler(async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(409).json({ error: "Missing credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    
    let user = await User.findOne({ email: payload.email });

    if (user) {
      
      const token = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      return res
        .status(200)
        .cookie("session", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ message: "logged in successfully", data: user });
    } else {
      const new_user = await User.create({
        email: payload.email,
        username: payload.name,
        profile_pic: payload.picture,
      });

      const token = jwt.sign(
        { _id: new_user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      console.log(new_user);
      return res
        .status(200)
        .cookie("session", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ message: "logged in successfully", data: new_user });
    }
  } catch (err) {
    console.error(err);
    res.status(401).json(new ApiError(401, "Invalid user credential"));
  }
});


const Google_log_out = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  if(!user_id) throw new ApiError("201","you have to login first to logout")
  res
    .status(200)
    .cookie("session", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0),
    })
    .json({
      message: "User deleted successfully",
      data: null,
    });
});

const get_profile = asyncHandler(async (req,res) => {
  const user = req.user
  if(!user) throw new ApiError(201,"login must be required")
  res.status(200).json({message : "data fetching successfully",data : user})
})

export { Google_log_in, Google_log_out,get_profile };

