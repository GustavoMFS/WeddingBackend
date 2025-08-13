import express from "express";
import { QrCodePix } from "qrcode-pix";

const router = express.Router();

router.post("/generate-pix", async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    const qrCodePix = QrCodePix({
      version: "01",
      key: "gustavo.mariavolskis@gmail.com",
      name: "Gustavo M Santos",
      city: "CURITIBA",
      message: "Casamento",
      value: value,
    });

    const payload = qrCodePix.payload();
    const qrCodeImage = await qrCodePix.base64();

    return res.json({
      payload,
      qrCodeImage,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao gerar QR Code Pix" });
  }
});

export default router;
