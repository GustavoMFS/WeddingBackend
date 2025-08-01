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

router.get("/", verifyUser, getAllGifts);
router.post("/:id/messages", verifyUser, addGiftMessage);

// Nova rota para Stripe
router.post("/:id/create-checkout-session", verifyUser, createCheckoutSession);

// Admin routes
router.post("/", verifyAdmin, createGift);
router.put("/:id", verifyAdmin, updateGift);
router.delete("/:id", verifyAdmin, deleteGift);
router.get("/:id", verifyUser, getGiftById);

export default router;
