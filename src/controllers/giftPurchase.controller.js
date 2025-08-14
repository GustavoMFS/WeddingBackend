import GiftPurchase from "../models/GiftPurchase.js";

export const getAllGiftPurchases = async (req, res) => {
  try {
    const purchases = await GiftPurchase.find().sort({ createdAt: -1 }).lean();
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};
