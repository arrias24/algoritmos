import { loadFile, data } from "./data.js";
import { runAllAlgorithms } from "./algoritms.js";

// Hacer las funciones globales para el HTML
window.loadFile = async () => {
  await loadFile();
  showDataPreview();
};

window.runAlgorithms = () => {
  const quantum = parseInt(document.getElementById("quantum").value) || 4;
  showResults(quantum);
};

// Mostrar vista previa de datos cargados
function showDataPreview() {
  const preview = document.getElementById("dataPreview");
  const content = document.getElementById("previewContent");

  if (data && data.length > 0) {
    preview.style.display = "block";
    content.innerHTML = `
                    <p><strong>Total de procesos:</strong> ${data.length}</p>
                    <div style="max-height: 200px; overflow-y: auto; margin-top: 10px;">
                        <table style="width: 100%; font-size: 12px;">
                            <thead>
                                <tr>
                                    <th>Proceso</th>
                                    <th>Llegada</th>
                                    <th>Duración</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data
                                  .map(
                                    (proc) => `
                                    <tr>
                                        <td>${proc.name}</td>
                                        <td>${proc.ti}</td>
                                        <td>${proc.t}</td>
                                    </tr>
                                `
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                `;
  }
}

// Mostrar resultados
async function showResults(quantum) {
  const loading = document.getElementById("loading");
  const resultsContainer = document.getElementById("resultsContainer");

  loading.style.display = "block";
  resultsContainer.innerHTML = "";

  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const results = runAllAlgorithms(quantum);

    loading.style.display = "none";

    if (!results) return;

    // Mostrar resultados
    Object.values(results).forEach((algorithm) => {
      const algorithmDiv = document.createElement("div");
      algorithmDiv.className = "algorithm-result";

      algorithmDiv.innerHTML = `
                        <h3>${algorithm.type} ${
        algorithm.quantum ? `(Quantum: ${algorithm.quantum})` : ""
      }</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Proceso</th>
                                    <th>Llegada</th>
                                    <th>Duración</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th>T. Total</th>
                                    <th>T. Espera</th>
                                    <th>Índice Serv.</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${algorithm.processes
                                  .map(
                                    (process) => `
                                    <tr>
                                        <td>${process.name}</td>
                                        <td>${process.ti}</td>
                                        <td>${process.t}</td>
                                        <td>${process.start}</td>
                                        <td>${process.finish}</td>
                                        <td>${process.totalTime}</td>
                                        <td>${process.waitingTime}</td>
                                        <td>${process.serviceIndex}</td>
                                    </tr>
                                `
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                        <div class="averages">
                            <strong>Promedios:</strong>
                            T. Total: ${algorithm.averages.avgTotal.toFixed(
                              2
                            )} | 
                            T. Espera: ${algorithm.averages.avgWaiting.toFixed(
                              2
                            )} | 
                            Índice: ${algorithm.averages.avgIndex.toFixed(4)}
                        </div>
                        <div class="real-time">
                            <strong>Tiempo real de ejecución:</strong> ${algorithm.realTime.toFixed(
                              2
                            )} ms
                        </div>
                    `;

      resultsContainer.appendChild(algorithmDiv);
    });
  } catch (error) {
    loading.style.display = "none";
    alert("Error al ejecutar los algoritmos: " + error.message);
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  console.log("Simulador de Planificación de Procesos cargado");
});
