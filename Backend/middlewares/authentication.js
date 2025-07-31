const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const logger = require("../utils/logger");
const dotenv = require("dotenv");
// dotenv configuration
dotenv.config({
  path: "./.env",
});

const checkAuthenticated = async (req, res, next) => {
  const tokenValue = req.cookies[process.env.TOKEN_NAME];

  if (!tokenValue) {
    logger.error("Token not found");
    return res.status(400).json({
      success: false,
      message: "Bad request!!",
    });
  }
  try {
    const payload = await jwt.verify(
      tokenValue,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!payload) {
      logger.error("Payload not found");
      return res.status(400).json({
        success: false,
        message: "Bad request!!",
      });
    }

    req.user = payload;

    return next();
  } catch (error) {
    logger.error("Something went wrong while authentication : ", error);
    return res.status(500).json({
      success: true,
      message: "Something went wrong..",
    });
  }
};

const checkAuthenticatedHeader = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { checkAuthenticated, checkAuthenticatedHeader };
