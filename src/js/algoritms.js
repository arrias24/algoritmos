import { data } from "./data.js";
import { formatResults } from "./metrics.js";

const cloneData = () => {
  return JSON.parse(JSON.stringify(data));
};

// Algoritmo FIFO
export const fifo = () => {
  const startReal = performance.now();
  const processes = cloneData();

  let finish = new Array(processes.length).fill(null);
  let clk = 0;

  // Ordenar por tiempo de llegada (FIFO)
  let procesos = Array.from(processes.keys());

  while (finish.some((v) => v === null)) {
    let processed = false;

    for (let k = 0; k < procesos.length; k++) {
      let i = procesos[k];

      if (finish[i] === null) {
        let startT = Number(processes[i].ti);
        let duration = Number(processes[i].t);

        if (clk >= startT) {
          // Simular procesamiento
          finish[i] = clk + duration;
          clk = finish[i];
          processed = true;
          break;
        }
      }
    }

    if (!processed) {
      clk += 1;
    }
  }

  // Convertir a la estructura que espera formatResults
  const processResults = processes.map((p, index) => ({
    name: p.name,
    ti: p.ti,
    t: p.t,
    start: finish[index] - p.t,
    finish: finish[index],
    totalTime: 0,
    waitingTime: 0,
    serviceIndex: 0,
  }));

  const endReal = performance.now();
  return formatResults(processResults, null, endReal - startReal, "FIFO");
};

// Algoritmo LIFO

export const lifo = () => {
  const startReal = performance.now();
  const processes = cloneData();

  let finish = new Array(processes.length).fill(null);
  let clk = 0;

  // Ordenar índices por tiempo de llegada descendente (LIFO)
  let indices = Array.from(processes.keys());
  indices.reverse();

  while (finish.some((v) => v === null)) {
    let processed = false;

    for (let k = 0; k < indices.length; k++) {
      let i = indices[k];

      if (finish[i] === null) {
        let startT = Number(processes[i].ti);
        let duration = Number(processes[i].t);

        if (clk >= startT) {
          // Simular procesamiento
          finish[i] = clk + duration;
          clk = finish[i];
          processed = true;
          break;
        }
      }
    }

    if (!processed) {
      clk += 1;
    }
  }

  // Convertir a la estructura que espera formatResults
  const processResults = processes.map((p, index) => ({
    name: p.name,
    ti: p.ti,
    t: p.t,
    start: finish[index] - p.t,
    finish: finish[index],
    totalTime: 0,
    waitingTime: 0,
    serviceIndex: 0,
  }));

  const endReal = performance.now();
  return formatResults(processResults, null, endReal - startReal, "LIFO");
};

// Algoritmo Round Robin (RR)
export const roundRobin = (quantum = 4) => {
  const startReal = performance.now();
  const processes = cloneData();

  let clk = 0;
  const finishTimes = new Array(processes.length).fill(null);
  const remainingTimes = processes.map((p) => Number(p.t));

  while (finishTimes.some((finish) => finish === null)) {
    let processExecuted = false;

    for (let i = 0; i < processes.length; i++) {
      const arrivalTime = Number(processes[i].ti);

      if (clk >= arrivalTime && finishTimes[i] === null) {
        if (remainingTimes[i] <= quantum) {
          clk += remainingTimes[i];
          finishTimes[i] = clk;
        } else {
          clk += quantum;
          remainingTimes[i] -= quantum;
        }
        processExecuted = true;
      }
    }

    if (!processExecuted) {
      clk += 1;
    }
  }

  const endReal = performance.now();

  // Crear estructura de resultados similar al formato original
  const processResults = processes.map((p, i) => ({
    name: p.name,
    ti: p.ti,
    t: p.t,
    start: finishTimes[i] - p.t,
    finish: finishTimes[i],
    totalTime: finishTimes[i] - p.ti,
    waitingTime: finishTimes[i] - p.ti - p.t,
    serviceIndex: i,
  }));

  return formatResults(
    processResults,
    null,
    endReal - startReal,
    "Round Robin",
    quantum
  );
};

// Función para ejecutar todos los algoritmos
export const runAllAlgorithms = (quantum = 4) => {
  if (!data || data.length === 0) {
    alert("No hay datos cargados. Por favor carga un archivo primero.");
    return null;
  }

  return {
    fifo: fifo(),
    lifo: lifo(),
    roundRobin: roundRobin(quantum),
  };
};

window.algorithms = { fifo, lifo, roundRobin, runAllAlgorithms };
