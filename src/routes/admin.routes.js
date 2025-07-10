import express from "express";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.get("/check-admin", verifyAdmin, (req, res) => {
  res.json({ message: "Usuário autorizado", email: req.adminEmail });
});

export default router;
