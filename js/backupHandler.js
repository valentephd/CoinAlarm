function displayLocalStorageData() {
  const backupSections = document.getElementById("backupSections");
  if (!backupSections) return;

  backupSections.innerHTML = ""; // Clear existing content

  Object.keys(localStorage).forEach(key => {
    const data = localStorage.getItem(key);
    const section = document.createElement("div");
    section.innerHTML = `
      <h3>${key}</h3>
      <pre>${formatJSON(data)}</pre>
      <button onclick="saveData('${key}')">Salvar ${key}</button>
    `;
    backupSections.appendChild(section);
  });
}

function formatJSON(data) {
  try {
    return JSON.stringify(JSON.parse(data), null, 2); // Format JSON data
  } catch {
    return data; // Return raw data if it's not valid JSON
  }
}

function saveData(key) {
  const data = localStorage.getItem(key);
  if (!data) {
    alert(`Nenhum dado encontrado para ${key}.`);
    return;
  }
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${key}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function saveAllData() {
  const allData = {};
  Object.keys(localStorage).forEach(key => {
    try {
      allData[key] = JSON.parse(localStorage.getItem(key)); // Parse JSON data
    } catch {
      allData[key] = localStorage.getItem(key); // Save raw data if it's not JSON
    }
  });
  const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "allData.json";
  a.click();
  URL.revokeObjectURL(url);
}
