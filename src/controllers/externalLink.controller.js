import ExternalLink from "../models/ExternalLink.js";

// Criar um link externo
export const createExternalLink = async (req, res) => {
  try {
    const link = new ExternalLink(req.body);
    await link.save();
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Listar todos os links ativos
export const getAllExternalLinks = async (req, res) => {
  try {
    const links = await ExternalLink.find({ active: true });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Buscar um link por ID
export const getExternalLinkById = async (req, res) => {
  try {
    const link = await ExternalLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: "Link não encontrado" });
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Atualizar um link
export const updateExternalLink = async (req, res) => {
  try {
    const link = await ExternalLink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!link) return res.status(404).json({ message: "Link não encontrado" });
    res.json(link);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Deletar um link
export const deleteExternalLink = async (req, res) => {
  try {
    const link = await ExternalLink.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ message: "Link não encontrado" });
    res.json({ message: "Link removido com sucesso" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
