document.addEventListener("DOMContentLoaded", () => {
    const backupSections = document.getElementById("backupSections");
    if (!backupSections) return;

    backupSections.innerHTML = ""; // Clear existing content

    console.log('DEPURANDO ...')

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        console.log('Key ::: ', key)
    }

    /*
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let value = localStorage.getItem(key);

        try {
            value = JSON.stringify(JSON.parse(value), null, 4); // Format JSON if possible
        } catch {
            // Value is not JSON, keep it as is
        }

        const section = document.createElement("section");
        section.innerHTML = `
            <h3>${key}</h3>
            <pre>${value}</pre>
        `;
        backupSections.appendChild(section);
    }
    */
});
