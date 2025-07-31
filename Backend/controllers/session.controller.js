const Session = require("../models/session.model");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// GET /sessions - Public wellness sessions
const getPublicSessions = catchAsyncErrors(async (req, res) => {
  const sessions = await Session.find({ status: "published" }).sort({ updated_at: -1 });
  res.json({ success: true, data: sessions });
});

// GET /my-sessions - User’s own sessions
const getUserSessions = catchAsyncErrors(async (req, res) => {
  const sessions = await Session.find({ user_id: req.user._id }).sort({ updated_at: -1 });
  res.json({ success: true, data: sessions });
});

// GET /my-sessions/:id - View a single session
const getSessionById = catchAsyncErrors(async (req, res) => {
  const session = await Session.findOne({ _id: req.params.id, user_id: req.user._id });
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }
  res.json({ success: true, data: session });
});

// POST /my-sessions/save-draft - Save or update draft
const saveDraft = catchAsyncErrors(async (req, res) => {
  const { id, title, tags, json_file_url } = req.body;
  const sessionData = {
    user_id: req.user._id,
    title,
    tags,
    json_file_url,
    status: "draft",
  };

  let session;
  if (id) {
    session = await Session.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      sessionData,
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
  } else {
    sessionData.created_at = new Date();
    session = await Session.create(sessionData);
  }

  res.json({ success: true, message: "Draft saved", data: session });
});

// POST /my-sessions/publish - Publish session
const publishSession = catchAsyncErrors(async (req, res) => {
  const { id, title, tags, json_file_url } = req.body;
  const sessionData = {
    user_id: req.user._id,
    title,
    tags,
    json_file_url,
    status: "published",
    updated_at: new Date(),
  };

  let session;
  if (id) {
    session = await Session.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      sessionData,
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
  } else {
    sessionData.created_at = new Date();
    session = await Session.create(sessionData);
  }

  res.json({ success: true, message: "Session published", data: session });
});

module.exports = {
  getPublicSessions,
  getUserSessions,
  getSessionById,
  saveDraft,
  publishSession,
};
