document.getElementById("submit").addEventListener("click", function () {
  const asset = document.getElementById("asset-dropdown").value;
  const stride = document.getElementById("stride-dropdown").value;
  const damage = parseInt(document.getElementById("damage").value) || 0;
  const reproducibility =
    parseInt(document.getElementById("reproducibility").value) || 0;
  const exploitability =
    parseInt(document.getElementById("exploitability").value) || 0;
  const affectedUsers =
    parseInt(document.getElementById("affectedUsers").value) || 0;
  const discoverability =
    parseInt(document.getElementById("discoverability").value) || 0;

  const payload = {
    asset,
    stride,
    damage,
    reproducibility,
    exploitability,
    affectedUsers,
    discoverability,
  };

  fetch(
    "https://utsmitigasi-56xq72v66-danymarufs-projects.vercel.app//analyze",
    {
      // Ganti dengan URL backend di Vercel
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const resultDiv = document.getElementById("result");
      resultDiv.innerText = `Hasil Analisis: ${data.analysis}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Mendefinisikan penjelasan untuk setiap STRIDE
const strideDescriptions = {
  spoofing: "Penyamaran identitas atau entitas.",
  tampering: "Modifikasi data secara ilegal.",
  repudiation: "Menolak melakukan tindakan yang seharusnya dapat ditelusuri.",
  information_disclosure:
    "Pengungkapan informasi sensitif kepada pihak yang tidak berwenang.",
  denial_of_service: "Menghentikan atau membatasi akses terhadap layanan.",
  elevation_of_privilege:
    "Mendapatkan hak akses yang lebih tinggi dari yang seharusnya.",
  security_misconfiguration:
    "Konfigurasi keamanan yang tidak tepat atau kelalaian dalam pengaturan.",
  insecure_deserialization:
    "Memproses data yang tidak aman dapat mengakibatkan eksekusi kode berbahaya.",
};

// Menambahkan event listener untuk dropdown STRIDE
document
  .getElementById("stride-dropdown")
  .addEventListener("change", function () {
    const selectedStride = this.value;
    const descriptionElement = document.getElementById("stride-description");

    // Menampilkan penjelasan yang sesuai di bawah dropdown
    descriptionElement.innerText = strideDescriptions[selectedStride];
  });

// Inisialisasi penjelasan saat halaman dimuat
document.getElementById("stride-description").innerText =
  strideDescriptions[document.getElementById("stride-dropdown").value];
