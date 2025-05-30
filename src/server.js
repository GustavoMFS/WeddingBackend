import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(` Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(" MongoDB connection error:", err));
