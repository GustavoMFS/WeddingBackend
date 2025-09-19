import express from "express";
import {
  createExternalLink,
  getAllExternalLinks,
  getExternalLinkById,
  updateExternalLink,
  deleteExternalLink,
} from "../controllers/externalLink.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Admin Routes
router.post("/admin", verifyAdmin, createExternalLink);
router.get("/admin", verifyAdmin, getAllExternalLinks);
router.get("/admin/:id", verifyAdmin, getExternalLinkById);
router.put("/admin/:id", verifyAdmin, updateExternalLink);
router.delete("/admin/:id", verifyAdmin, deleteExternalLink);

// Guest Routes
router.get("/", verifyUser, getAllExternalLinks);

export default router;
