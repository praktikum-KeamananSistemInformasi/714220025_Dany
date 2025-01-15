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
    historyList.innerHTML = "";
    history.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `#${index + 1} - STRIDE: ${
        item.stride
      }, DREAD: ${JSON.stringify(item.dreadScores)}`;
      historyList.appendChild(li);
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
        body: JSON.stringify({ stride, dreadScores }),
      });

      const data = await response.json();

      // Tutup dialog loading setelah analisis selesai
      Swal.close();

      // Tampilkan hasil analisis
      analysisText.innerHTML = data.analysis;
      resultDiv.classList.remove("hidden");

      // Simpan ke riwayat dan render chart
      saveToHistory(stride, dreadScores, data.analysis);
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
