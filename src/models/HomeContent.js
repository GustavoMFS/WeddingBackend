import mongoose from "mongoose";

const homeContentSchema = new mongoose.Schema({
  coupleNames: String,
  date: String,
  time: String,
  location: String,
  introText: String,
  mapEmbedUrl: String,
  imageUrl: String, // relative path, e.g., /couple.jpg
});

const HomeContent = mongoose.model("HomeContent", homeContentSchema);

export default HomeContent;
