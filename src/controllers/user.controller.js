// database always in another contient
// so if we use findOne, create use Async/Await also for cloudinary

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// We use most of time Access Token and Refresh Token that why we create a method.
// we don't we asyncHandler bcz we don't handle any web request
const  generateAccessAndRefreshTokens = async(userId) =>{
  try {
    // We get user here document or a object here
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Refresh and Access Token")
  }
}

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
    throw new ApiError(409, 'User with email or username already exists');
  }

  // middleware kya karta hai ki req ke aandhar oor jadha field add karta hai.
  // Ass: req.files ko console.log karo
  console.log(req.files);
  
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path
  // console.log(avatarLocalPath);

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // for multer
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is file required');
  }

  // upload Images to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // for cloudinary
  if (!avatar) {
    throw new ApiError(400, 'Avatar is file required');
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the User.');
  }

  //   res.status postman ko ye chahiye
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered Successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body se data leke aaye 
  // Username or email
  // find the user
  // if username founed password check
  // access token and refresh token send to the user
  // we secure Send cookies 

  const { email, username, password } = req.body

  // if (!(username && email)) do no chahiye
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required")
  } 

  // How we find user send username or email
  // findOne find first entire in database
  // $or $and $nor are mongoDB operators 
  const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  // User: Capital User means this mongoDB moongoose methods like findOne(), findMany(), create()
  // user: This is instance we create from database we apply our methods we get from user.model.js 
  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect") // Invalid user Credentials
  }

  const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  // Send cookies: 

  const loggedInUser = User.findById(user._id).select("-password -refreshToken")
  
  const options = {
    httpOnly: true,    // By default anyone any modify form front end
    secure: true,      // But When you httpOnly: true secure: true then it modify by sever or backend
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200, 
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    )
});

const logoutUser = asyncHandler( async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { // kya kya update karna hai i want this fields
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,    
    secure: true,      
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json( new ApiResponse(200, {}, "User logout successfully"))
})

export { registerUser, loginUser, logoutUser };
