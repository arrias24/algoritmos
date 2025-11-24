// metrics.js - Funciones de cálculo de métricas

// Función para calcular métricas individuales de procesos
export const calculateMetrics = (processes) => {
  return processes.map((process) => {
    const totalTime = process.finish - process.ti;
    const waitingTime = totalTime - process.t;
    const serviceIndex = parseFloat((process.t / totalTime).toFixed(4));

    return {
      ...process,
      totalTime,
      waitingTime,
      serviceIndex,
    };
  });
};

// Función para calcular promedios
export const calculateAverages = (processesWithMetrics) => {
  if (processesWithMetrics.length === 0) {
    return {
      avgTotal: 0,
      avgWaiting: 0,
      avgIndex: 0,
    };
  }

  const totalTimes = processesWithMetrics.map((p) => p.totalTime);
  const waitingTimes = processesWithMetrics.map((p) => p.waitingTime);
  const serviceIndices = processesWithMetrics.map((p) => p.serviceIndex);

  return {
    avgTotal: totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length,
    avgWaiting: waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length,
    avgIndex: serviceIndices.reduce((a, b) => a + b, 0) / serviceIndices.length,
  };
};

// Función para formatear resultados finales
export const formatResults = (
  processes,
  averages,
  realTime,
  type,
  quantum = null
) => {
  const processesWithMetrics = calculateMetrics(processes);

  return {
    processes: processesWithMetrics,
    averages: calculateAverages(processesWithMetrics),
    realTime,
    type,
    quantum,
  };
};
