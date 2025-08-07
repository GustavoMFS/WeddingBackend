import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    value: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ["full", "partial"],
      default: "full",
    },
    active: { type: Boolean, default: true },
    messages: [
      {
        name: String,
        message: String,
        value: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Gift", GiftSchema);
