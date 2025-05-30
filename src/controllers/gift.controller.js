import Gift from "../models/Gift.js";

// Criar um presente
export const createGift = async (req, res) => {
  try {
    const gift = new Gift(req.body);
    await gift.save();
    res.status(201).json(gift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Listar todos os presentes ativos
export const getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find({ active: true });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Buscar um presente pelo ID
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

// Atualizar presente
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

// Deletar presente
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

// Adicionar mensagem ao presente
export const addGiftMessage = async (req, res) => {
  const { name, message, value } = req.body;

  if (!name || !message || value == null) {
    return res
      .status(400)
      .json({
        message: "Todos os campos são obrigatórios: name, message, value",
      });
  }

  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift)
      return res.status(404).json({ message: "Presente não encontrado" });

    // Adiciona mensagem
    gift.messages.push({ name, message, value });

    // Atualiza valor arrecadado
    gift.amountCollected += value;

    // Se ativou o disableOnGoalReached e atingiu valor, desativa presente
    if (gift.disableOnGoalReached && gift.amountCollected >= gift.value) {
      gift.active = false;
    }

    await gift.save();

    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
