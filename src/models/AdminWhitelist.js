import mongoose from "mongoose";

const AdminWhitelistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

export default mongoose.model("AdminWhitelist", AdminWhitelistSchema);
