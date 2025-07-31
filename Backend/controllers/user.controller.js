const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const User = require("../models/user.model.js");
const logger = require("../utils/logger.js");
const { add } = require("winston");

// Register or Sign up new User
const registerUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.create({
    email,
    password,
  });

  if (!user) {
    logger.warn("User not created something went wrong.");
    return res.status(500).json({
      success: false,
      message: "User not created something went wrong.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User is registered successfully",
  });
});

// Login user in our web app
const loginUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    logger.warn("User not found with this email");
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const checkUser = await user.isPasswordCorrect(password);

  if (!checkUser) {
    logger.warn("Password is incorrect");
    return res.status(500).json({
      success: false,
      message: "Password is incorrect",
    });
  }

  const token = await user.generateRefreshToken();

  if (!token) {
    logger.warn("Token creation failed");
    return res.status(500).json({
      success: false,
      message: "token not created something went wrong.",
    });
  }

  const isProduction = process.env.NODE_ENV === "production";

  const data = {
    _id: user._id,
    email: user.email,
    created_at: user.created_at,
    token,
  };

  return res
    .status(200)
    .cookie(process.env.TOKEN_NAME, token, {
      path: "/",
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: "User is successfully logged in.",
      data,
    });
});

// Logout user in our web app
const logoutUser = catchAsyncErrors(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  logger.info("User is logged out successfully");
  return res
    .clearCookie(process.env.TOKEN_NAME, {
      path: "/",
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      httpOnly: true,
    })
    .status(201)
    .json({
      success: true,
      message: "User is logged out successfully",
    });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
