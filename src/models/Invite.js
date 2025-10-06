import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    pin: { type: String, required: true },
    confirmed: { type: Boolean, default: null },
    confirmedAt: { type: Date },
  },
  { timestamps: true }
);

InviteSchema.index({ pin: 1 }, { unique: true });

export default mongoose.model("Invite", InviteSchema);
