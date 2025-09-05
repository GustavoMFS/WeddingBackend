import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema(
  {
    inviteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invite",
      required: true,
    },
    name: { type: String, required: true },
    tags: [String],
    isAdult: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Guest", GuestSchema);
