// src/routes/gift.routes.js
import express from "express";
import {
  createGift,
  getAllGifts,
  getGiftById,
  updateGift,
  deleteGift,
  addGiftMessage,
} from "../controllers/gift.controller.js";
import { verifyGuest } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Convidados
router.get("/", verifyGuest, getAllGifts);
router.post("/:id/messages", verifyGuest, addGiftMessage);

// Noivos (admin)
router.post("/", verifyAdmin, createGift);
router.put("/:id", verifyAdmin, updateGift);
router.delete("/:id", verifyAdmin, deleteGift);
router.get("/:id", verifyAdmin, getGiftById);

export default router;
