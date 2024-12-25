// Import libraries
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

// Fungsi query untuk memanggil API GPT-4
async function query(data) {
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // Endpoint OpenAI API
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a security analyst." },
          { role: "user", content: data.prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000, // Timeout setelah 8 detik
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error saat memanggil API OpenAI:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Route untuk analisis
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

  if (
    !asset ||
    !stride ||
    damage == null ||
    reproducibility == null ||
    exploitability == null ||
    affectedUsers == null ||
    discoverability == null
  ) {
    return res
      .status(400)
      .json({ error: "Semua parameter harus diisi dan valid." });
  }

  const prompt = `
Analisis risiko keamanan:
- Aset: ${asset}
- STRIDE: ${stride}
- Damage: ${damage}
- Reproducibility: ${reproducibility}
- Exploitability: ${exploitability}
- Affected Users: ${affectedUsers}
- Discoverability: ${discoverability}

Analisis harus mencakup:
1. Penilaian tingkat risiko (rendah, sedang, tinggi).
2. Rekomendasi mitigasi yang jelas dan spesifik.
  `;

  try {
    console.log("Memulai permintaan ke OpenAI API...");
    const response = await query({ prompt });
    console.log("Response diterima:", response);
    res.json({
      analysis: response.choices[0]?.message?.content || "Tidak ada hasil.",
    });
  } catch (error) {
    console.error("Error saat memanggil API:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan." });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
