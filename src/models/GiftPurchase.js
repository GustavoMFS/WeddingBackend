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
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("GiftPurchase", GiftPurchaseSchema);
