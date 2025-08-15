import { MercadoPagoConfig, Payment } from "mercadopago";
import Gift from "../models/Gift.js";
import GiftPurchase from "../models/GiftPurchase.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export const createPixPayment = async (req, res) => {
  try {
    const { giftId, name, message, value, transaction_amount } = req.body;
    const amount = Number(transaction_amount ?? value);

    if (!giftId || !name || !message || !amount) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const gift = await Gift.findById(giftId);
    if (!gift) {
      return res.status(404).json({ message: "Presente não encontrado" });
    }

    const payment = await new Payment(client).create({
      body: {
        transaction_amount: amount,
        description: gift.title || "Presente de casamento",
        payment_method_id: "pix",
        payer: {
          email: "pagador@email.com",
          first_name: name,
          last_name: "Convidado",
          identification: {
            type: "CPF",
            number: "19119119100",
          },
        },
      },
    });

    return res.status(200).json({
      paymentId: payment.id,
      qr_code: payment.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        payment.point_of_interaction.transaction_data.qr_code_base64,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento Pix:", error);
    return res.status(500).json({ message: "Erro ao criar pagamento Pix" });
  }
};

export const verifyPixPayment = async (req, res) => {
  try {
    const { paymentId, giftId, name, message, value } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "ID do pagamento é obrigatório" });
    }

    const payment = await new Payment(client).get({ id: paymentId });

    if (payment.status === "approved") {
      const gift = await Gift.findById(giftId);
      if (gift) {
        const payer = payment.payer || {};
        await GiftPurchase.create({
          giftId: gift._id,
          giftTitle: gift.title,
          name,
          message,
          value,
          email: payer.email || undefined,
          payerName:
            `${payer.first_name || ""} ${payer.last_name || ""}`.trim() ||
            undefined,
          payerId: payer.identification?.number || undefined,
        });

        gift.amountCollected = (gift.amountCollected || 0) + value;
        await gift.save();
      }

      return res.json({ paid: true });
    } else {
      return res.json({ paid: false, status: payment.status });
    }
  } catch (error) {
    console.error("Erro ao verificar pagamento Pix:", error);
    return res.status(500).json({ message: "Erro ao verificar pagamento Pix" });
  }
};
