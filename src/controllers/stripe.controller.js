import stripe from "../config/stripe.js";
import Gift from "../models/Gift.js";
import GiftPurchase from "../models/GiftPurchase.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Erro no webhook Stripe:", err.message);
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

      if (!gift) {
        console.warn("Presente não encontrado:", giftId);
      } else {
        await GiftPurchase.create({
          giftId: gift._id,
          giftTitle: gift.title,
          name,
          message,
          value,
        });

        gift.amountCollected = (gift.amountCollected || 0) + value;
        await gift.save();

        console.log(`Compra registrada para o presente ${giftId}`);
      }
    } catch (err) {
      console.error("Erro ao salvar compra do presente:", err);
    }
  }

  res.json({ received: true });
};
