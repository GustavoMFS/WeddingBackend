import mongoose from "mongoose";

const ExternalLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("ExternalLink", ExternalLinkSchema);
