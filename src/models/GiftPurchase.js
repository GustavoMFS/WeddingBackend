import mongoose from "mongoose";

const GiftPurchaseSchema = new mongoose.Schema(
  {
    giftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gift",
      required: true,
    },
    giftTitle: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    value: { type: Number, required: true },
    email: { type: String, required: false },
    payerName: { type: String },
    payerId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("GiftPurchase", GiftPurchaseSchema);
