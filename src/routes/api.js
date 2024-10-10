const express = require('express');
const router = express.Router();
//authController
const authController = require("../controller/authController");
// authMiddleware
const {isLogIn} = require("../moddleware/authMiddleware")

// auth api

router.post("/user-signup", authController.signUp);
router.post("/user-signin", authController.signIn);
router.get("/user-profile" , isLogIn, authController.userProfile )


module.exports = router;