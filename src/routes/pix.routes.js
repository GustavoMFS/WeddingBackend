import express from "express";
import {
  createPixPayment,
  verifyPixPayment,
} from "../controllers/pix.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-payment", verifyUser, createPixPayment);
router.post("/verify-payment", verifyUser, verifyPixPayment);

export default router;
