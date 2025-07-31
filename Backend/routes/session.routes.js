const express = require("express");
const router = express.Router();
const {
  getPublicSessions,
  getUserSessions,
  getSessionById,
  saveDraft,
  publishSession,
} = require("../controllers/session.controller");
const { checkAuthenticated } = require("../middlewares/authentication");

router.get("/sessions", getPublicSessions); // public
router.get("/my-sessions", checkAuthenticated, getUserSessions);
router.get("/my-sessions/:id", checkAuthenticated, getSessionById);
router.post("/my-sessions/save-draft", checkAuthenticated, saveDraft);
router.post("/my-sessions/publish", checkAuthenticated, publishSession);

module.exports = router;
