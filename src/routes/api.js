const express = require('express');
const router = express.Router();
//authController
const authController = require("../controller/authController");
// authMiddleware
const {isLogIn} = require("../moddleware/authMiddleware")
// forget password controller
const forgetPasswordController = require("../controller/forgetPasswordController");

// auth api

router.post("/user-signup", authController.signUp);
router.post("/user-signin", authController.signIn);
router.get("/user-profile" , isLogIn, authController.userProfile);
router.put("/profile-updated", isLogIn, authController.updateProfile);

// forget api

router.get("/send-email", forgetPasswordController.sendEmailUser);
router.get("/otp-verify", forgetPasswordController.verifyOtp);
router.post("/password-reset", forgetPasswordController.resetPassword);


module.exports = router;