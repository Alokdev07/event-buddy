import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'

dotenv.config()

const verify_admin = async (req, res, next) => {
  try {
    // 1. Check if token exists
    const token = req?.cookies?.adminToken
    if (!token) throw new ApiError(401, "No admin token provided")

    // 2. Verify token
    const decode_token = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET)

    // 3. Find user
    const user = await User.findOne({ email: decode_token.email })
    if (!user) throw new ApiError(401, "User not found")

    // 5. Attach admin to request
    req.admin = user
    next()
  } catch (error) {
    console.log("Error in check admin : ", error)
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error"
    })
  }
}

export default verify_admin
