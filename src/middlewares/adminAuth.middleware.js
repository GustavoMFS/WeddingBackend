import { jwtVerify, createRemoteJWKSet } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("https://precise-redbird-90.clerk.accounts.dev/.well-known/jwks.json")
);

export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "https://precise-redbird-90.clerk.accounts.dev",
    });

    if (payload.public_metadata?.role !== "admin") {
      return res.status(403).json({ message: "Acesso negado: não é admin" });
    }

    req.adminEmail = payload.email;
    next();
  } catch (err) {
    console.error("Erro na verificação do token:", err);
    return res.status(403).json({ message: "Token inválido ou acesso negado" });
  }
};
