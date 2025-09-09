import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  inviteId: { type: String, required: true },
  question: { type: String, required: true },
  required: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Question = mongoose.model("Question", questionSchema);
