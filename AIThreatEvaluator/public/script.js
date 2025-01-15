document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("threatForm");
  const submitBtn = document.getElementById("submitBtn");
  const resultDiv = document.getElementById("result");
  const analysisText = document.getElementById("analysisText");
  const dreadChart = document.getElementById("dreadChart");
  const historyList = document.getElementById("historyList");

  // Fungsi untuk menyimpan riwayat hasil analisis
  const saveToHistory = (stride, dreadScores, analysis) => {
    const history = JSON.parse(localStorage.getItem("analysisHistory")) || [];
    history.push({ stride, dreadScores, analysis });
    localStorage.setItem("analysisHistory", JSON.stringify(history));
    displayHistory();
  };

  // Fungsi untuk menampilkan riwayat
  const displayHistory = () => {
    const history = JSON.parse(localStorage.getItem("analysisHistory")) || [];
    historyList.innerHTML = ""; // Kosongkan daftar riwayat

    if (history.length === 0) {
      historyList.innerHTML = "<li>Belum ada riwayat analisis.</li>";
      return;
    }

    history.forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add(
        "mb-3",
        "p-3",
        "border",
        "rounded-lg",
        "bg-gray-100",
        "shadow"
      );

      // Buat elemen HTML untuk menampilkan data riwayat secara ringkas
      li.innerHTML = `
        <div class="flex justify-between items-center">
          <h4 class="font-bold text-indigo-600">Analisis #${index + 1}</h4>
          <button 
            class="text-indigo-500 hover:underline focus:outline-none" 
            id="toggleDetail${index}">
            Lihat Detail
          </button>
        </div>
        <p><strong>STRIDE:</strong> ${item.stride}</p>
        <div id="detail${index}" class="hidden mt-2">
          <p><strong>DREAD Scores:</strong></p>
          <ul class="list-disc ml-6">
            <li><strong>Damage:</strong> ${item.dreadScores.damage}</li>
            <li><strong>Reproducibility:</strong> ${
              item.dreadScores.reproducibility
            }</li>
            <li><strong>Exploitability:</strong> ${
              item.dreadScores.exploitability
            }</li>
            <li><strong>Affected Users:</strong> ${
              item.dreadScores.affectedUsers
            }</li>
            <li><strong>Discoverability:</strong> ${
              item.dreadScores.discoverability
            }</li>
          </ul>
          <p class="mt-2"><strong>Hasil Analisis:</strong></p>
          <p class="text-gray-700">${item.analysis}</p>
        </div>
      `;

      historyList.appendChild(li);

      // Tambahkan event listener untuk toggle detail
      const toggleButton = document.getElementById(`toggleDetail${index}`);
      const detailDiv = document.getElementById(`detail${index}`);
      toggleButton.addEventListener("click", () => {
        if (detailDiv.classList.contains("hidden")) {
          detailDiv.classList.remove("hidden");
          toggleButton.textContent = "Sembunyikan Detail";
        } else {
          detailDiv.classList.add("hidden");
          toggleButton.textContent = "Lihat Detail";
        }
      });
    });
  };

  // Fungsi untuk menampilkan grafik skor DREAD
  const renderChart = (dreadScores) => {
    const ctx = dreadChart.getContext("2d");
    dreadChart.classList.remove("hidden");

    new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "Damage",
          "Reproducibility",
          "Exploitability",
          "Affected Users",
          "Discoverability",
        ],
        datasets: [
          {
            label: "Skor DREAD",
            data: Object.values(dreadScores),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0,
            max: 10,
          },
        },
      },
    });
  };

  submitBtn.addEventListener("click", async () => {
    // Ambil nilai input
    const context = document.getElementById("context").value; // Ambil konteks ancaman
    const stride = document.getElementById("stride").value;
    const dreadScores = {
      damage: parseInt(document.getElementById("damage").value, 10),
      reproducibility: parseInt(
        document.getElementById("reproducibility").value,
        10
      ),
      exploitability: parseInt(
        document.getElementById("exploitability").value,
        10
      ),
      affectedUsers: parseInt(
        document.getElementById("affectedUsers").value,
        10
      ),
      discoverability: parseInt(
        document.getElementById("discoverability").value,
        10
      ),
    };

    if (!context) {
      Swal.fire({
        icon: "error",
        title: "Konteks Wajib Diisi",
        text: "Harap masukkan konteks ancaman.",
      });
      return;
    }

    // Hitung total skor DREAD
    const totalScore =
      dreadScores.damage +
      dreadScores.reproducibility +
      dreadScores.exploitability +
      dreadScores.affectedUsers +
      dreadScores.discoverability;

    // Tentukan warna berdasarkan tingkat ancaman
    let threatLevel = "";
    let colorClass = "";
    if (totalScore >= 35) {
      threatLevel = "Tinggi";
      colorClass = "bg-red-500 text-white";
    } else if (totalScore >= 20) {
      threatLevel = "Sedang";
      colorClass = "bg-yellow-400 text-black";
    } else {
      threatLevel = "Rendah";
      colorClass = "bg-green-500 text-white";
    }

    // Tampilkan dialog loading menggunakan SweetAlert2
    Swal.fire({
      title: "Proses Analisis...",
      text: "Mohon tunggu, sedang memproses data.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Kirim data ke server
    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, stride, dreadScores }),
      });

      const data = await response.json();

      // Tutup dialog loading setelah analisis selesai
      Swal.close();

      // Tampilkan hasil analisis
      analysisText.innerHTML = `
      <div class="p-4 rounded ${colorClass}">
        <p><strong>Total Skor DREAD:</strong> ${totalScore}</p>
        <p><strong>Tingkat Ancaman:</strong> ${threatLevel}</p>
        <p><strong>Tingkat Ancaman:</strong> ${context}</p>
        <p>${data.analysis}</p>
      </div>
    `;
      resultDiv.classList.remove("hidden");

      // Simpan ke riwayat dan render chart
      saveToHistory(context, stride, dreadScores, data.analysis);
      renderChart(dreadScores);

      // Tampilkan notifikasi sukses menggunakan SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Analisis Berhasil!",
        text: "Hasil analisis telah ditampilkan.",
      });
    } catch (error) {
      // Tutup dialog loading jika terjadi error
      Swal.close();

      console.error("Error fetching analysis:", error);

      // Tampilkan error menggunakan SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Data",
        text: "Tidak dapat mengirim data ke server. Coba lagi nanti.",
      });
    }
  });

  // Tampilkan riwayat saat halaman dimuat
  displayHistory();
});
