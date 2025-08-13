import Gift from "../models/Gift.js";
import stripe from "../config/stripe.js";

export const createGift = async (req, res) => {
  try {
    const gift = new Gift(req.body);
    await gift.save();
    res.status(201).json(gift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find({ active: true });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGiftById = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift)
      return res.status(404).json({ message: "Presente não encontrado" });
    res.json(gift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!gift)
      return res.status(404).json({ message: "Presente não encontrado" });
    res.json(gift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    if (!gift)
      return res.status(404).json({ message: "Presente não encontrado" });
    res.json({ message: "Presente removido com sucesso" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addGiftMessage = async (req, res) => {
  const { name, message, value } = req.body;

  if (!name || !message || value == null) {
    return res.status(400).json({
      message: "Todos os campos são obrigatórios: name, message, value",
    });
  }

  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift)
      return res.status(404).json({ message: "Presente não encontrado" });

    gift.messages.push({ name, message, value });

    await gift.save();

    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, value } = req.body;

    if (!name || !message || value == null) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const gift = await Gift.findById(id);
    if (!gift)
      return res.status(404).json({ message: "Presente não encontrado" });

    if (value <= 0) {
      return res.status(400).json({ message: "Valor deve ser maior que zero" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: gift.title,
              description:
                gift.description && gift.description.trim() !== ""
                  ? gift.description
                  : undefined,
              images: gift.image ? [gift.image] : undefined,
            },
            unit_amount: Math.round(value * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        giftId: id,
        name,
        message,
        value: value.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/presentes/success`,
      cancel_url: `${process.env.FRONTEND_URL}/presentes/${id}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar sessão Stripe" });
    console.log({ message: err.message, stack: err.stack });
  }
};
