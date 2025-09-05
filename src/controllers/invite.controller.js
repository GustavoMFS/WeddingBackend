import Invite from "../models/Invite.js";
import Guest from "../models/Guest.js";

// Gera PIN de 4 dígitos
const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

// Criar novo convite
export const createInvite = async (req, res) => {
  try {
    const { identifier, email, phone } = req.body;
    const existing = await Invite.findOne({ identifier });
    if (existing) {
      return res.status(400).json({ message: "Identifier já existe." });
    }

    const pin = generatePin();

    const invite = new Invite({ identifier, email, phone, pin });
    await invite.save();

    res.status(201).json(invite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Buscar todos os convites
export const getInvitesByUser = async (req, res) => {
  try {
    const invites = await Invite.find();
    res.json(invites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Adicionar convidado a um convite
export const addGuestToInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { name, tags, isAdult } = req.body;

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Convite não encontrado." });
    }

    const guestCount = await Guest.countDocuments({ inviteId });
    if (guestCount >= 15) {
      return res
        .status(400)
        .json({ message: "Limite de 15 convidados atingido." });
    }

    const guest = new Guest({ inviteId, name, tags, isAdult });
    await guest.save();

    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { identifier, email, phone } = req.body;

    const invite = await Invite.findById(inviteId);
    if (!invite)
      return res.status(404).json({ message: "Convite não encontrado" });

    invite.identifier = identifier ?? invite.identifier;
    invite.email = email ?? invite.email;
    invite.phone = phone ?? invite.phone;

    await invite.save();
    res.json(invite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    await Invite.findByIdAndDelete(inviteId);
    await Guest.deleteMany({ inviteId });
    res.json({ message: "Convite e convidados removidos" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Buscar convidados de um convite
export const getGuestsByInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ message: "Convite não encontrado." });
    }

    const guests = await Guest.find({ inviteId });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
