import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
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

export default router