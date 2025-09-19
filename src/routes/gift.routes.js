import express from "express";
import {
  createGift,
  getAllGifts,
  getGiftById,
  updateGift,
  deleteGift,
  addGiftMessage,
  createCheckoutSession,
} from "../controllers/gift.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();
// Admin routes
router.get("/admin", verifyAdmin, getAllGifts);
router.post("/admin", verifyAdmin, createGift);
router.put("/admin/:id", verifyAdmin, updateGift);
router.delete("/admin/:id", verifyAdmin, deleteGift);
router.get("/admin/:id", verifyAdmin, getGiftById);

//rota para Stripe
router.post("/:id/create-checkout-session", verifyUser, createCheckoutSession);

// Guest routes
router.get("/", verifyUser, getAllGifts);
router.post("/:id/messages", verifyUser, addGiftMessage);
router.get("/:id", verifyUser, getGiftById);

export default router;
