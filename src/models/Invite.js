import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    pin: { type: String, required: true },
  },
  { timestamps: true }
);

InviteSchema.index({ identifier: 1, pin: 1 }, { unique: true });

export default mongoose.model("Invite", InviteSchema);
