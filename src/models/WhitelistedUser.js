import mongoose from "mongoose";

const WhitelistedUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

export default mongoose.model("WhitelistedUser", WhitelistedUserSchema);
