import express from "express";
import {
  createCardPayment,
  verifyCardPayment,
  getInstallments,
  cardPaymentWebhook,
} from "../controllers/mpcard.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/card-payment", verifyUser, createCardPayment);

router.post("/verify-card-payment", verifyUser, verifyCardPayment);
router.get("/installments", verifyUser, getInstallments);
router.post("/webhook", cardPaymentWebhook);

export default router;
