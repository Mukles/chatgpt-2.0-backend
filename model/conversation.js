const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  firstMessage: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [
    {
      sender: { type: "string" },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Conversation", conversationSchema);
