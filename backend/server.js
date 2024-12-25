const express = require("express");
const cors = require("cors");
const axios = require("axios");

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
  res.send(
    "Server berjalan dengan baik. Gunakan endpoint /analyze untuk analisis."
  );
});

// Fungsi untuk memanggil API Hugging Face
async function query(data) {
  const apiUrl = "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B";

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // API Key dari environment variable
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saat memanggil API Hugging Face:", error.response?.data || error.message);
    throw error;
  }
}

// Route untuk /analyze
app.post("/analyze", async (req, res) => {
  const {
    asset,
    stride,
    damage,
    reproducibility,
    exploitability,
    affectedUsers,
    discoverability,
  } = req.body;

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
    const response = await query({ inputs: prompt });
    res.json({ analysis: response[0]?.generated_text || "Tidak ada hasil." });
  } catch (error) {
    console.error("Error di endpoint /analyze:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan." });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
