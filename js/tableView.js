document.addEventListener("DOMContentLoaded", function () {
    atualizarTabelaCryptos();
    document.getElementById("atualizarTabelaBtn").addEventListener("click", atualizarTabelaCryptos);
});

function atualizarTabelaCryptos() {
    const tabelaBody = document.querySelector("#cryptoTable tbody");
    tabelaBody.innerHTML = ""; // Limpa o corpo da tabela

    const compras = JSON.parse(localStorage.getItem("cryptoPurchases")) || [];

    if (compras.length === 0) {
        let row = tabelaBody.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.textContent = "Nenhuma compra registrada.";
        cell.style.textAlign = "center";
        return;
    }

    // Agrupar compras por moeda
    const resumoCryptos = {};

    compras.forEach(compra => {
        const { moeda, quantidade, valorTotal } = compra;
        if (!resumoCryptos[moeda]) {
            resumoCryptos[moeda] = { totalQuantity: 0, totalInvestido: 0 };
        }
        resumoCryptos[moeda].totalQuantity += parseFloat(quantidade);
        resumoCryptos[moeda].totalInvestido += parseFloat(valorTotal);
    });

    Object.keys(resumoCryptos).forEach(moeda => {
        const { totalQuantity, totalInvestido } = resumoCryptos[moeda];
        const precoMedio = totalInvestido / totalQuantity;
        let row = tabelaBody.insertRow();
        row.insertCell(0).textContent = moeda;
        row.insertCell(1).textContent = totalQuantity;
        row.insertCell(2).textContent = `R$ ${totalInvestido.toFixed(2)}`;
        row.insertCell(3).textContent = `R$ ${precoMedio.toFixed(2)}`;
    });
}
