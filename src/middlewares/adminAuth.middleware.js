import jwt from "jsonwebtoken";
import axios from "axios";
import WhitelistedUser from "../models/WhitelistedUser.js";

export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifica token no Clerk (pode mudar conforme o provider)
    const response = await axios.get("https://api.clerk.dev/v1/tokens/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userEmail = response.data?.email_address;
    if (!userEmail) {
      return res.status(401).json({ message: "Email não encontrado no token" });
    }

    const isWhitelisted = await WhitelistedUser.findOne({ email: userEmail });
    if (!isWhitelisted) {
      return res.status(403).json({ message: "Acesso restrito ao painel" });
    }

    req.userEmail = userEmail; // opcional, caso precise depois
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token inválido ou erro de verificação" });
  }
};
