import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtVerify, createRemoteJWKSet } from "jose";

dotenv.config();

const JWKS_URL = process.env.CLERK_JWKS_URL;
const CLERK_ISSUER = process.env.CLERK_ISSUER;

const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

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
      issuer: CLERK_ISSUER,
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
