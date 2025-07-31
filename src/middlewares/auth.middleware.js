import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtVerify, createRemoteJWKSet } from "jose";

dotenv.config();

const JWKS = createRemoteJWKSet(
  new URL("https://precise-redbird-90.clerk.accounts.dev/.well-known/jwks.json")
);

export const verifyUser = async (req, res, next) => {
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
    }
  } catch (err) {}

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "https://precise-redbird-90.clerk.accounts.dev",
    });

    if (payload.public_metadata?.role === "admin") {
      req.userRole = "admin";
      req.adminEmail = payload.email;
      return next();
    } else {
      return res.status(403).json({ message: "Acesso negado: não é admin" });
    }
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(403).json({ message: "Token inválido ou acesso negado" });
  }
};
