document.addEventListener("DOMContentLoaded", () => {
    const backupSections = document.getElementById("backupSections");
    const saveAllButton = document.getElementById("saveAllButton");

    if (!backupSections || !saveAllButton) return;

    backupSections.innerHTML = ""; // Clear existing content

    saveAllButton.addEventListener("click", saveAllData);

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let value = localStorage.getItem(key);

        try {
            value = JSON.stringify(JSON.parse(value), null, 4); // Format JSON if possible
        } catch {
            // Value is not JSON, keep it as is
        }

        const accordion = document.createElement("button");
        accordion.className = "accordion";
        accordion.innerHTML = `
            <span>${key}</span>
            <span class="arrow">▶</span>
        `;

        const panel = document.createElement("div");
        panel.className = "panel";
        panel.style.display = "none"; // Ensure the panel starts collapsed

        const textArea = document.createElement("textarea");
        textArea.readOnly = true;
        textArea.value = value;

        const saveButton = document.createElement("button");
        saveButton.className = "save-button";
        saveButton.textContent = `Salvar ${key}`;
        saveButton.onclick = () => saveData(key, value);

        panel.appendChild(textArea);
        panel.appendChild(saveButton);

        accordion.addEventListener("click", () => {
            const isActive = accordion.classList.toggle("active");
            panel.style.display = isActive ? "block" : "none";
        });

        backupSections.appendChild(accordion);
        backupSections.appendChild(panel);
    }
});

function saveData(key, value) {
    const blob = new Blob([value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${key}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function saveAllData() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        saveData(key, value);
    }
}
