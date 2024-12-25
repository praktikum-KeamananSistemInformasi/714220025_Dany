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

  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "Memproses analisis...";

  fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      resultDiv.innerText = `Hasil Analisis: ${data.analysis}`;
      updateTableAndChart(payload, data.analysis);
    })
    .catch((error) => {
      resultDiv.innerText = "Terjadi kesalahan. Coba lagi.";
      console.error(error);
    });
});

function updateTableAndChart(payload, analysis) {
  const tableBody = document.querySelector("#risk-table tbody");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td>${payload.asset}</td>
    <td>${payload.stride}</td>
    <td>${
      payload.damage +
      payload.reproducibility +
      payload.exploitability +
      payload.affectedUsers +
      payload.discoverability
    }</td>
    <td>${analysis}</td>
    <td>Belum ditinjau</td>
  `;
  tableBody.appendChild(newRow);

  const ctx = document.getElementById("chart").getContext("2d");
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
          label: "Nilai Risiko",
          data: [
            payload.damage,
            payload.reproducibility,
            payload.exploitability,
            payload.affectedUsers,
            payload.discoverability,
          ],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
        },
      ],
    },
  });
}
