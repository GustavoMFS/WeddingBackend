import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const VALID_PASSWORD = process.env.GUEST_PASSWORD;

router.post("/login", (req, res) => {
  console.log("Requisição recebida:", req.body);
  const { password } = req.body;

  if (password !== VALID_PASSWORD) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign({ role: "guest" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

export default router;
