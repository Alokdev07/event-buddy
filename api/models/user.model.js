import mongoose from "mongoose";

const user_schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  profile_pic : {
    type : String
  }
}<{timestamps : true});

export const User = mongoose.model("User",user_schema)
