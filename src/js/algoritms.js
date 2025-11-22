import { data } from "./data.js";
import { formatResults } from "./metrics.js";

// Función para clonar datos profundamente
const cloneData = () => {
  return JSON.parse(JSON.stringify(data));
};

// Algoritmo FIFO
export const fifo = () => {
  const startReal = performance.now();
  const processes = cloneData();

  let finish = new Array(processes.length).fill(null);
  let clk = 0;

  // Ordenar índices por tiempo de llegada (FIFO)
  let indices = Array.from(processes.keys());

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
  let currentTime = 0;
  let processesCompleted = 0;

  // Crear estructura de datos
  const processResults = processes.map((p, index) => ({
    name: p.name,
    ti: p.ti,
    t: p.t,
    start: null,
    finish: null,
    totalTime: 0,
    waitingTime: 0,
    serviceIndex: 0,
  }));

  const remainingTimes = processes.map((p) => p.t);
  const completed = new Array(processes.length).fill(false);

  while (processesCompleted < processes.length) {
    let processExecuted = false;

    // Recorrer todos los procesos en orden
    for (let i = 0; i < processResults.length; i++) {
      // Verificar si el proceso está listo y no completado
      if (processResults[i].ti <= currentTime && remainingTimes[i] > 0) {
        // Ejecutar por quantum o el tiempo restante
        const executionTime = Math.min(quantum, remainingTimes[i]);
        remainingTimes[i] -= executionTime;
        currentTime += executionTime;
        processExecuted = true;

        // Marcar tiempo de inicio si es la primera vez
        if (processResults[i].start === null) {
          processResults[i].start = currentTime - executionTime;
        }

        // Si el proceso se completó
        if (remainingTimes[i] === 0) {
          processResults[i].finish = currentTime;
          completed[i] = true;
          processesCompleted++;
        }
      }
    }

    if (!processExecuted) {
      // Avanzar al siguiente tiempo de llegada
      let nextArrival = Infinity;
      for (let i = 0; i < processResults.length; i++) {
        if (remainingTimes[i] > 0) {
          nextArrival = Math.min(nextArrival, processResults[i].ti);
        }
      }
      currentTime = Math.max(currentTime, nextArrival);
    }
  }

  const endReal = performance.now();
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
