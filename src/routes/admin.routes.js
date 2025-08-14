import express from "express";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { getAllGiftPurchases } from "../controllers/giftPurchase.controller.js";

const router = express.Router();

router.get("/check-admin", verifyAdmin, (req, res) => {
  res.json({ message: "Usuário autorizado", email: req.adminEmail });
});

router.get("/gift-purchases", verifyAdmin, getAllGiftPurchases);

export default router;
