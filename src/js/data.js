export let data = [];

// Función para cargar el archivo seleccionado por el usuario
export const loadFile = async () => {
  const fileInput = document.querySelector(".input-file");
  const file = fileInput.files[0];

  if (!fileInput) {
    throw new Error("No se encontró el elemento fileInput");
  }

  if (!file) {
    alert("Por favor selecciona un archivo");
    return;
  }

  try {
    const fileContent = await readFile(file);
    data = await getData(fileContent);
    data ? null : alert("No se pudieron procesar los datos del archivo");
  } catch (error) {
    console.error("Error loading file:", error);
    alert("Error al cargar el archivo");
  }
};

// Función para leer el archivo
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

// Función para procesar los datos (JSON o CSV)
export const getData = async (data) => {
  try {
    let parsedData = null;

    if (typeof data === "string") {
      // Detectar si es JSON
      const trimmedData = data.trim();
      if (trimmedData.startsWith("{") || trimmedData.startsWith("[")) {
        try {
          const jsonObject = JSON.parse(data);
          parsedData = parseJSON(jsonObject);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          parsedData = parseCSV(data);
        }
      } else {
        parsedData = parseCSV(data);
      }
    } else if (typeof data === "object" && data !== null) {
      parsedData = parseJSON(data);
    } else {
      console.warn(`Tipo de dato no soportado: ${typeof data}`);
      return null;
    }

    return parsedData;
  } catch (error) {
    console.error("Error parsing data:", error);
    return null;
  }
};

// Función para parsear JSON
const parseJSON = (jsonData) => {
  if (!jsonData || typeof jsonData !== "object") {
    throw new Error("Datos JSON inválidos");
  }

  if (Array.isArray(jsonData)) {
    return jsonData.map((item) => ({
      name: item.name || item.nombre || "",
      ti: parseInt(item.ti || item.tiempo_llegada || item.tiempo || 0),
      t: parseInt(item.t || item.tiempo_ejecucion || item.tiempo || 0),
    }));
  }

  return Object.entries(jsonData).map(([key, values]) => {
    let ti, t;

    if (Array.isArray(values)) {
      ti = parseInt(values[0]) || 0;
      t = parseInt(values[1]) || 0;
    } else if (typeof values === "object" && values !== null) {
      ti = parseInt(values.ti || values.tiempo_llegada || 0);
      t = parseInt(values.t || values.tiempo_ejecucion || 0);
    } else {
      ti = 0;
      t = 0;
    }

    return {
      name: key,
      ti: ti,
      t: t,
    };
  });
};

// Función para parsear CSV
const parseCSV = (csvString) => {
  const lines = csvString.trim().split("\n");
  const result = [];

  const startLine = lines[0].includes("name,ti,t") ? 1 : 0;
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const [name, ti, t] = line.split(",");
      result.push({
        name: (name || "").trim(),
        ti: ti ? parseInt(ti.trim()) : 0,
        t: t ? parseInt(t.trim()) : 0,
      });
    }
  }

  return result;
};

window.loadFile = loadFile;
