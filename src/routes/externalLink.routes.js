import express from "express";
import {
  createExternalLink,
  getAllExternalLinks,
  getExternalLinkById,
  updateExternalLink,
  deleteExternalLink,
} from "../controllers/externalLink.controller.js";
import { verifyGuest } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Convidados
router.get("/", verifyGuest, getAllExternalLinks);

// Noivos (admin)
router.post("/", verifyAdmin, createExternalLink);
router.get("/:id", verifyAdmin, getExternalLinkById);
router.put("/:id", verifyAdmin, updateExternalLink);
router.delete("/:id", verifyAdmin, deleteExternalLink);

export default router;
