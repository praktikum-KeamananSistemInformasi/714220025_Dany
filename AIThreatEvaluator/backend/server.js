const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Mengizinkan akses dari frontend

// Konfigurasi API GPT
const openai = new OpenAI({
  apiKey:
    "", // Masukkan API Key Anda di sini
});

// Endpoint untuk analisis ancaman
app.post("/analyze", async (req, res) => {
  const { context, stride, dreadScores } = req.body;

  if (!context || !stride || !dreadScores) {
    return res
      .status(400)
      .json({ error: "Konteks, STRIDE, dan DREAD wajib diisi!" });
  }

  const prompt = `
    Konteks ancaman: ${context}.
    Ancaman keamanan yang terdeteksi: ${stride}.
    Skor DREAD:
    - Damage Potential: ${dreadScores.damage}
    - Reproducibility: ${dreadScores.reproducibility}
    - Exploitability: ${dreadScores.exploitability}
    - Affected Users: ${dreadScores.affectedUsers}
    - Discoverability: ${dreadScores.discoverability}
  
    Berdasarkan data di atas:
    1. Berikan analisis mendetail terkait ancaman dalam konteks ${context}.
    2. Saran langkah-langkah mitigasi spesifik untuk konteks tersebut.
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const analysis = response.choices[0].message.content.trim();
    res.json({ analysis });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses data." });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
