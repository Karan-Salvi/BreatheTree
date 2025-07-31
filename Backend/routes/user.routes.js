const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller.js");
const { checkAuthenticated } = require("../middlewares/authentication.js");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(checkAuthenticated, logoutUser);
module.exports = router;
