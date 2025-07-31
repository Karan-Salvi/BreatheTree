const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    tags: [String],
    json_file_url: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
