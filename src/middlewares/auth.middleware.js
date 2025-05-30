import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyGuest = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "guest") throw new Error("Acesso negado");
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
