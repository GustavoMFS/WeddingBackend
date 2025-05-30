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

const router = express.Router();

router.get("/", verifyGuest, getAllGifts);
router.get("/:id", verifyGuest, getGiftById);
router.post("/:id/message", verifyGuest, addGiftMessage);

// admin rotas podem ser separadas futuramente
router.post("/", createGift);
router.put("/:id", updateGift);
router.delete("/:id", deleteGift);

export default router;
