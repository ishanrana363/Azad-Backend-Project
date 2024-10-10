const express = require('express');
const router = express.Router();
//authController
const authController = require("../controller/authController");

// auth api

router.post("/user-signup", authController.signUp);
router.post("/user-signin", authController.signIn);

module.exports = router;