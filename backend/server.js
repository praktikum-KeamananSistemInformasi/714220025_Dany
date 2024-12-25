const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
const corsOptions = {
  origin: "https://praktikum-keamanansisteminformasi.github.io", // URL GitHub Pages Anda
};
app.use(cors(corsOptions));
app.use(express.json());

// Route untuk root
app.get("/", (req, res) => {
  console.log("Server.js terbaru berjalan dengan fungsi query!");
  res.send(
    "Server berjalan dengan baik. Gunakan endpoint /analyze untuk analisis."
  );
});

// Fungsi query untuk memanggil API Hugging Face
async function query(data) {
  const apiUrl =
    "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B";

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error saat memanggil API Hugging Face:",
      error.response?.data || error.message
    );
    throw error; // Pastikan error dilempar agar bisa ditangkap di endpoint
  }
}

// Route untuk analisis
app.post("/analyze", async (req, res) => {
  // Pastikan body dari permintaan berisi data yang diharapkan
  const {
    asset,
    stride,
    damage,
    reproducibility,
    exploitability,
    affectedUsers,
    discoverability,
  } = req.body;

  // Validasi input untuk memastikan semua data ada
  if (
    !asset ||
    !stride ||
    !damage ||
    !reproducibility ||
    !exploitability ||
    !affectedUsers ||
    !discoverability
  ) {
    return res
      .status(400)
      .json({ error: "Semua parameter harus diisi dalam request body." });
  }

  // Membuat prompt untuk analisis
  const prompt = `
    Analisis keamanan:
    - Aset: ${asset}
    - STRIDE: ${stride}
    - Damage: ${damage}
    - Reproducibility: ${reproducibility}
    - Exploitability: ${exploitability}
    - Affected Users: ${affectedUsers}
    - Discoverability: ${discoverability}

    Berikan analisis risiko dan rekomendasi mitigasi yang sesuai.
  `;

  try {
    // Memanggil fungsi query untuk mendapatkan analisis
    const response = await query({ inputs: prompt });

    // Mengirimkan hasil analisis ke klien
    res.json({ analysis: response[0]?.generated_text || "Tidak ada hasil." });
  } catch (error) {
    console.error("Error di endpoint /analyze:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat menganalisis." });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
