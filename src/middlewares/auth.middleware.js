import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "guest") {
      req.userRole = "guest";
      return next();
    } else {
      return res.status(403).json({ message: "Acesso negado" });
    }
  } catch (err) {
    console.error("Erro na verificação do token de guest:", err);
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
