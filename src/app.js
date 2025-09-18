import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import giftRoutes from "./routes/gift.routes.js";
import authRoutes from "./routes/auth.routes.js";
import externalLinkRoutes from "./routes/externalLink.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import pixRoutes from "./routes/pix.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import inviteRoutes from "./routes/invite.routes.js";
import guestRoutes from "./routes/guest.routes.js";
import questionRoutes from "./routes/questions.routes.js";
import mpcardRoutes from "./routes/mpcard.routes.js";
import bodyParser from "body-parser";

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

app.use("/api/stripe", stripeRoutes);

// app.use(express.json());
app.use(bodyParser.json({ type: "*/*" }));
+app.use("/api/auth", authRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/links", externalLinkRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pix", pixRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/mpcard", mpcardRoutes);
app.use("/api", guestRoutes);

export default app;
