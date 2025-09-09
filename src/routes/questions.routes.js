import express from "express";
import {
  getQuestionsByInvite,
  createQuestion,
} from "../controllers/questions.controller.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.get(
  "/:inviteId",
  async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "Token não fornecido" });
      }
      next();
    } catch (err) {
      next(err);
    }
  },
  getQuestionsByInvite
);

router.post("/", verifyAdmin, createQuestion);

export default router;
