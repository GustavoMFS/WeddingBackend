import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import Gift from "../models/Gift.js";
import GiftPurchase from "../models/GiftPurchase.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export const createCheckoutPreference = async (req, res) => {
  try {
    const { giftId, name, message, value } = req.body;

    if (!giftId || !name || !message || !value) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const gift = await Gift.findById(giftId);
    if (!gift) {
      return res.status(404).json({ message: "Presente não encontrado" });
    }

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: gift._id.toString(),
            title: gift.title,
            quantity: 1,
            currency_id: "BRL",
            unit_price: Number(value),
          },
        ],
        payer: {
          name,
          email: "comprador@email.com",
        },
        payment_methods: {
          installments: 12,
          excluded_payment_types: [{ id: "ticket" }, { id: "pix" }],
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/presentes/success`,
          failure: `${process.env.FRONTEND_URL}/presentes/failure`,
          pending: `${process.env.FRONTEND_URL}/presentes/pending`,
        },
        auto_return: "approved",
        metadata: {
          giftId: gift._id.toString(),
          name,
          message,
          value,
        },
      },
    });

    return res.status(200).json({ init_point: preference.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência Mercado Pago:", error);
    return res
      .status(500)
      .json({ message: "Erro ao criar preferência Mercado Pago" });
  }
};

export const mercadoPagoWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "payment" && event.data?.id) {
      const paymentId = event.data.id;

      const payment = await new Payment(client).get({ id: paymentId });

      if (payment.status === "approved") {
        const metadata = payment.metadata || {};
        const giftId = metadata.giftId;
        const name = metadata.name || payment.payer?.first_name || "Convidado";
        const message = metadata.message || "Presente via Checkout Pro";
        const value = Number(metadata.value || payment.transaction_amount);

        const gift = await Gift.findById(giftId);
        if (gift) {
          await GiftPurchase.create({
            giftId: gift._id,
            giftTitle: gift.title,
            name,
            message,
            value,
            email: payment.payer?.email,
            payerName: `${payment.payer?.first_name || ""} ${
              payment.payer?.last_name || ""
            }`.trim(),
            payerId: payment.payer?.identification?.number,
          });

          gift.amountCollected = (gift.amountCollected || 0) + value;
          await gift.save();

          console.log(`Compra registrada para o presente ${giftId}`);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Erro no webhook Mercado Pago:", err);
    res.status(500).json({ error: "Erro no webhook Mercado Pago" });
  }
};
