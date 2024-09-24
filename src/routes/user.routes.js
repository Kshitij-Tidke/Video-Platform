import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    // Array We can't use it bcz array take single field multiple value. Ek hi field mai multiple value leta hai.  
    // If i want only get single value then use single
    upload.fields([
        {
            name: "avatar",  // Communication is imp
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), // It accepts array
    registerUser
)

router.route("/login").post(loginUser)

// Secured routes 
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails) // don't use post here bcz if we use post then it update all details 
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watchHistory").get(verifyJWT, getWatchHistory)

export default router