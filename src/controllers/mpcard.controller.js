import { MercadoPagoConfig, Payment } from "mercadopago";
import Gift from "../models/Gift.js";
import GiftPurchase from "../models/GiftPurchase.js";
import dotenv from "dotenv";

dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export const createCardPayment = async (req, res) => {
  try {
    const {
      giftId,
      transaction_amount,
      description,
      payment_method_id,
      token,
      installments,
      issuer_id,
      payer,
      name,
      message,
    } = req.body;

    if (
      !giftId ||
      !transaction_amount ||
      !payment_method_id ||
      !token ||
      !installments ||
      !payer ||
      !name ||
      !message
    ) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const gift = await Gift.findById(giftId);
    if (!gift) {
      return res.status(404).json({ message: "Presente não encontrado" });
    }

    const payment = await new Payment(client).create({
      body: {
        transaction_amount,
        token,
        description: description || gift.title,
        installments,
        payment_method_id,
        issuer_id,
        payer,
      },
    });

    if (payment.status === "approved") {
      await GiftPurchase.create({
        giftId: gift._id,
        giftTitle: gift.title,
        name,
        message,
        value: transaction_amount,
        email: payer.email,
        payerName: `${payer.first_name} ${payer.last_name}`.trim(),
        payerId: payer.identification?.number || undefined,
      });

      gift.amountCollected = (gift.amountCollected || 0) + transaction_amount;
      await gift.save();
    }

    res.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento de cartão:", error);
    res.status(500).json({ message: "Erro ao criar pagamento de cartão" });
  }
};

export const verifyCardPayment = async (req, res) => {
  try {
    const { paymentId, giftId } = req.body;
    if (!paymentId || !giftId) {
      return res
        .status(400)
        .json({ message: "Parâmetros obrigatórios faltando" });
    }

    const payment = await new Payment(client).get({ id: paymentId });
    res.json({ status: payment.status, status_detail: payment.status_detail });
  } catch (error) {
    console.error("Erro ao verificar pagamento de cartão:", error);
    res.status(500).json({ message: "Erro ao verificar pagamento de cartão" });
  }
};

export const getInstallments = async (req, res) => {
  try {
    const { amount, bin } = req.query;

    if (!amount || !bin) {
      return res
        .status(400)
        .json({ message: "Parâmetros amount e bin são obrigatórios" });
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payment_methods/installments?amount=${amount}&bin=${bin}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erro ao consultar parcelas:", error);
    res.status(500).json({ message: "Erro ao consultar parcelas" });
  }
};

export const cardPaymentWebhook = async (req, res) => {
  console.log("Webhook recebido:", req.method, req.url, req.body);

  try {
    const { type, action, data } = req.body;

    if (type === "payment" && data?.id) {
      const paymentId = data.id;

      const payment = await new Payment(client).get({ id: paymentId });

      console.log("Pagamento consultado:", payment);

      let purchase = await GiftPurchase.findOne({ paymentId });

      if (!purchase) {
        purchase = await GiftPurchase.create({
          giftId: null,
          giftTitle: payment.description,
          name: payment.payer?.first_name || "Desconhecido",
          message: "",
          value: payment.transaction_amount,
          email: payment.payer?.email,
          payerName: `${payment.payer?.first_name || ""} ${
            payment.payer?.last_name || ""
          }`.trim(),
          payerId: payment.payer?.identification?.number,
          paymentId: payment.id,
          status: payment.status,
        });
      } else {
        purchase.status = payment.status;
        await purchase.save();
      }

      if (purchase.giftId) {
        const gift = await Gift.findById(purchase.giftId);
        if (gift) {
          gift.amountCollected = (gift.amountCollected || 0) + purchase.value;
          await gift.save();
        }
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Erro no webhook do cartão:", err);

    res.status(200).send("OK");
  }
};
