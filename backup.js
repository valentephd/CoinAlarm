document.addEventListener('DOMContentLoaded', () => {
    const dataContainers = document.getElementById('dataContainers');
    const saveAllButton = document.getElementById('saveAllButton');

    const localStorageData = JSON.parse(JSON.stringify(localStorage)); // Clona o LocalStorage

    // Cria janelas para cada tipo de dado
    Object.keys(localStorageData).forEach(key => {
        const container = document.createElement('div');
        container.className = 'data-container';

        const title = document.createElement('h2');
        title.textContent = key;

        const textarea = document.createElement('textarea');
        textarea.value = JSON.stringify(JSON.parse(localStorageData[key]), null, 2);
        textarea.id = `textarea-${key}`;

        const saveButton = document.createElement('button');
        saveButton.textContent = `Salvar ${key}`;
        saveButton.onclick = () => downloadData(key, textarea.value);

        container.appendChild(title);
        container.appendChild(textarea);
        container.appendChild(saveButton);
        dataContainers.appendChild(container);
    });

    // Salva todos os dados juntos
    saveAllButton.addEventListener('click', () => {
        Object.keys(localStorageData).forEach(key => {
            const textarea = document.getElementById(`textarea-${key}`);
            downloadData(key, textarea.value);
        });
        alert('Todos os dados foram baixados!');
    });

    // Função para baixar um tipo de dado como arquivo JSON
    function downloadData(key, value) {
        try {
            const blob = new Blob([value], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${key}.json`;
            a.click();
            URL.revokeObjectURL(url);
            alert(`Dados de ${key} baixados com sucesso!`);
        } catch (error) {
            alert(`Erro ao baixar ${key}: ${error.message}`);
        }
    }
});
