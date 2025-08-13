import express from "express";
import stripe from "../config/stripe.js";
import Gift from "../models/Gift.js";

const router = express.Router();
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Erro no webhook Stripe:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const giftId = session.metadata.giftId;
        const name = session.metadata.name;
        const message = session.metadata.message;
        const value = parseFloat(session.metadata.value);

        const gift = await Gift.findById(giftId);
        if (gift) {
          gift.messages.push({ name, message, value });
          await gift.save();
          console.log("✅ Mensagem salva para presente:", giftId);
        }
      } catch (err) {
        console.error("Erro ao salvar mensagem do presente:", err);
      }
    }

    res.json({ received: true });
  }
);

export default router;
