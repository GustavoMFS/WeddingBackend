import express from "express";
import {
  createExternalLink,
  getAllExternalLinks,
  getExternalLinkById,
  updateExternalLink,
  deleteExternalLink,
} from "../controllers/externalLink.controller.js";

const router = express.Router();

// Listar links públicos (sem autenticação)
router.get("/", getAllExternalLinks);

// Admin (autenticado): criar, editar, excluir
router.post("/", createExternalLink);
router.get("/:id", getExternalLinkById);
router.put("/:id", updateExternalLink);
router.delete("/:id", deleteExternalLink);

export default router;
