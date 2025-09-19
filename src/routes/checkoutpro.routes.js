import express from "express";
import {
  createCheckoutPreference,
  mercadoPagoWebhook,
} from "../controllers/checkoutpro.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-preference", verifyUser, createCheckoutPreference);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  mercadoPagoWebhook
);

export default router;
