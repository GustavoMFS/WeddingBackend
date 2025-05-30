import HomeContent from "../models/HomeContent.js";

// GET: /api/home
export const getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar conteúdo da home." });
  }
};

// PUT: /api/home
export const updateHomeContent = async (req, res) => {
  try {
    const data = req.body;
    const updated = await HomeContent.findOneAndUpdate({}, data, {
      new: true,
      upsert: true, // cria se não existir
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar conteúdo da home." });
  }
};
