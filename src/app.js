import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import giftRoutes from "./routes/gift.routes.js";
import authRoutes from "./routes/auth.routes.js";
import externalLinkRoutes from "./routes/externalLink.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/links", externalLinkRoutes);
app.use("/api/admin", adminRoutes);

export default app;
