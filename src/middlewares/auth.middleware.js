// auth.middleware.js It simply check user is exist or not
// We use this multiple times like a for a upload video, like video, comment on video
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

// _ when we don't use the res, req then we can also put _
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // req.cookies?.accessToken isse token nikal lo
    // req.header("Authorization")?.replace("Bearer ", "") is for mobile ya isse token nikal lo
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    // Decoded Token information
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      // Todo discuss about frontend
      throw new ApiError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
});
