import { jwtVerify, createRemoteJWKSet } from "jose";
import dotenv from "dotenv";

dotenv.config();

const JWKS_URL = process.env.CLERK_JWKS_URL;
const CLERK_ISSUER = process.env.CLERK_ISSUER;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: CLERK_ISSUER });

    if (payload.public_metadata?.role !== "admin") {
      return res.status(403).json({ message: "Acesso negado: não é admin" });
    }

    req.userRole = "admin";
    req.adminEmail = payload.email;
    return next();
  } catch (err) {
    console.error("Erro na verificação do token:", err);
    return res.status(403).json({ message: "Token inválido ou acesso negado" });
  }
};

// import { jwtVerify, createRemoteJWKSet } from "jose";
// import dotenv from "dotenv";

// dotenv.config();

// const JWKS_URL = process.env.CLERK_JWKS_URL;
// const CLERK_ISSUER = process.env.CLERK_ISSUER;

// const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

// export const verifyAdmin = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Token não fornecido" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const { payload } = await jwtVerify(token, JWKS, {
//       issuer: CLERK_ISSUER,
//     });

//     if (payload.public_metadata?.role !== "admin") {
//       return res.status(403).json({ message: "Acesso negado: não é admin" });
//     }

//     req.adminEmail = payload.email;
//     next();
//   } catch (err) {
//     console.error("Erro na verificação do token:", err);
//     return res.status(403).json({ message: "Token inválido ou acesso negado" });
//   }
// };
