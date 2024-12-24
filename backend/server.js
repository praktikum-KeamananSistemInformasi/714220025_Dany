const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
const corsOptions = {
  origin: "https://praktikum-keamanansisteminformasi.github.io", // URL GitHub Pages Anda
};
app.use(cors(corsOptions));

app.use(express.json());

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
    // Panggil model Hugging Face (ganti sesuai konfigurasi Anda)
    const response = await query({ inputs: prompt });
    res.json({ analysis: response.generated_text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan." });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
