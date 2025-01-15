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
    "api gpt", // Masukkan API Key Anda di sini
});

// Endpoint untuk analisis ancaman
app.post("/analyze", async (req, res) => {
  const { stride, dreadScores } = req.body;

  if (!stride || !dreadScores) {
    return res
      .status(400)
      .json({ error: "Data STRIDE dan DREAD wajib diisi!" });
  }

  const prompt = `
    Ancaman keamanan yang terdeteksi: ${stride}.
    Skor DREAD:
    - Damage Potential: ${dreadScores.damage}
    - Reproducibility: ${dreadScores.reproducibility}
    - Exploitability: ${dreadScores.exploitability}
    - Affected Users: ${dreadScores.affectedUsers}
    - Discoverability: ${dreadScores.discoverability}
  
    Berdasarkan data di atas:
    1. Berikan analisis mendetail terkait ancaman tersebut.
    2. Saran langkah-langkah mitigasi yang dapat dilakukan.
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    // Format response dengan HTML sederhana
    const analysis = response.choices[0].message.content.trim();
    const formattedAnalysis = `
        <h3 class="font-bold text-lg">Analisis Ancaman:</h3>
        <p>${analysis.split("\n").join("</p><p>")}</p>
        <h3 class="font-bold text-lg mt-4">Saran Mitigasi:</h3>
        <ul class="list-disc list-inside">
          <li>Audit konfigurasi secara berkala.</li>
          <li>Implementasi enkripsi data.</li>
          <li>Gunakan firewall dan sistem pemantauan jaringan.</li>
        </ul>
      `;

    res.json({ analysis: formattedAnalysis });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses data." });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
