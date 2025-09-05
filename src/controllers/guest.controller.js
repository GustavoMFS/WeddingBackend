import Guest from "../models/Guest.js";

export const updateGuestStatus = async (req, res) => {
  const { guestId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "confirmed", "declined"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Status inválido." });
  }

  try {
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Convidado não encontrado." });
    }

    guest.status = status;
    await guest.save();

    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { name, isAdult, tags, status } = req.body;

    const guest = await Guest.findById(guestId);
    if (!guest)
      return res.status(404).json({ message: "Convidado não encontrado" });

    guest.name = name ?? guest.name;
    guest.isAdult = isAdult ?? guest.isAdult;
    guest.tags = tags ?? guest.tags;

    if (status) {
      const allowedStatuses = ["pending", "confirmed", "declined"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Status inválido." });
      }
      guest.status = status;
    }

    await guest.save();
    res.json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    await Guest.findByIdAndDelete(guestId);
    res.json({ message: "Convidado removido" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
