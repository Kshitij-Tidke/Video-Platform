// database always in another contient
// so if we use findOne, create use Async/Await also for cloudinary

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'

const registerUser = asyncHandler(async (req, res) => {
  // Steps
  // Get user details from frontend  => user.model.js
  // Validation - not empty => frontend and backend frontend miss something then backend take care.
  // Check if user already exists: Username, email
  // Check for images, check for avatar first we check at multer then
  // upload them to cloudinary, avatar.
  // create user object bcz when we sent data to the mongoDB. It is no sql database. And mostly we send objects or upload kiye jate hai then
  // create entry in db
  // remove password and refresh token field from response
  // check for user creation => null or success create
  // return res

  // forms => req.body()
  const { fullName, email, username, password } = req.body;
  // console.log('email: ', email);

  /* // Most beginners done this
    if (fullName === "") {
      throw new ApiError(400, "Full Name is required")
    }
    */

  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // findOne Firstly find entry
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }

  // middleware kya karta hai ki req ke aandhar oor jadha field add karta hai.
  // Ass: req.files ko console.log karo 
  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path
  // console.log(avatarLocalPath, coverImageLocalPath);

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }
  
  // for multer
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is file required")
  }

  // upload Images to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  // for cloudinary
  if (!avatar) {
    throw new ApiError(400, "Avatar is file required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the User.")
  }

//   res.status postman ko ye chahiye
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )

});

export { registerUser };