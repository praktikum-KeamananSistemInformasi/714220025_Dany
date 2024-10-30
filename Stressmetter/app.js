document.getElementById("submit").addEventListener("click", function () {
  // Mengambil nilai dari input
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

  // Menyiapkan data untuk chart
  const data = {
    labels: [
      "Damage",
      "Reproducibility",
      "Exploitability",
      "Affected Users",
      "Discoverability",
    ],
    datasets: [
      {
        label: `Aset: ${asset}, STRIDE: ${stride}`,
        data: [
          damage,
          reproducibility,
          exploitability,
          affectedUsers,
          discoverability,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Menghitung total nilai ancaman
  const totalRiskValue =
    damage + reproducibility + exploitability + affectedUsers + discoverability;

  // Menentukan tindakan mitigasi berdasarkan STRIDE
  let mitigationAction;
  switch (stride) {
    case "spoofing":
      mitigationAction =
        "Gunakan autentikasi multi-faktor (MFA) dan verifikasi identitas pengguna.";
      break;
    case "tampering":
      mitigationAction =
        "Terapkan kontrol akses yang ketat dan enkripsi data selama transit dan penyimpanan.";
      break;
    case "repudiation":
      mitigationAction =
        "Implementasikan logging yang komprehensif dan audit trail untuk memastikan semua tindakan dapat dilacak.";
      break;
    case "information_disclosure":
      mitigationAction =
        "Enkripsi data sensitif dan gunakan protokol yang aman (misalnya, HTTPS) untuk melindungi data dalam perjalanan.";
      break;
    case "denial_of_service":
      mitigationAction =
        "Gunakan firewall dan sistem deteksi intrusi untuk memantau dan membatasi lalu lintas berbahaya.";
      break;
    case "elevation_of_privilege":
      mitigationAction =
        "Terapkan prinsip least privilege dan lakukan audit hak akses secara berkala.";
      break;
    case "security_misconfiguration":
      mitigationAction =
        "Lakukan pengujian keamanan secara berkala dan pastikan konfigurasi sistem sesuai dengan praktik terbaik.";
      break;
    case "insecure_deserialization":
      mitigationAction =
        "Terapkan validasi input yang ketat dan hindari deserialisasi objek dari sumber yang tidak tepercaya.";
      break;
    default:
      mitigationAction = "Tindakan mitigasi tidak tersedia.";
  }

  // Menentukan review
  let review;
  if (totalRiskValue <= 10) {
    review = "Risiko rendah, pemantauan rutin diperlukan.";
  } else if (totalRiskValue <= 20) {
    review = "Risiko sedang, tindakan mitigasi segera diperlukan.";
  } else {
    review = "Risiko tinggi, tindakan mitigasi segera diperlukan!";
  }

  // Menambahkan data ke tabel mitigasi risiko
  const riskTableBody = document
    .getElementById("risk-table")
    .getElementsByTagName("tbody")[0];
  const newRow = riskTableBody.insertRow();
  newRow.insertCell(0).innerText =
    asset.charAt(0).toUpperCase() + asset.slice(1).replace("_", " ");
  newRow.insertCell(1).innerText = `${
    stride.charAt(0).toUpperCase() + stride.slice(1)
  }`;
  newRow.insertCell(2).innerText = totalRiskValue;
  newRow.insertCell(3).innerText = mitigationAction;
  newRow.insertCell(4).innerText = review;

  // Mengambil jenis chart dari dropdown
  const chartType = document.getElementById("chart-type").value;

  // Konfigurasi Chart
  const config = {
    type: chartType, // Menggunakan nilai dari dropdown jenis chart
    data: data,
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
        },
        y: {
          beginAtZero: true,
          max: 10,
        },
      },
    },
  };

  // Membuat atau memperbarui chart
  if (window.myChart) {
    window.myChart.destroy();
  }
  window.myChart = new Chart(document.getElementById("chart"), config);
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
