document.addEventListener("DOMContentLoaded", function () {
    atualizarTabelaCryptos();
    document.getElementById("atualizarTabelaBtn").addEventListener("click", atualizarTabelaCryptos);
});

function atualizarTabelaCryptos() {
    const tabelaBody = document.querySelector("#cryptoTable tbody");
    const totalInvestidoResumo = document.getElementById("totalInvestidoResumo");
    tabelaBody.innerHTML = ""; // Limpa a tabela antes de preencher

    const compras = JSON.parse(localStorage.getItem("cryptoPurchases")) || [];
    const alarmes = JSON.parse(localStorage.getItem("alarmes")) || [];
    
    if (compras.length === 0) {
        let row = tabelaBody.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 6;
        cell.textContent = "Nenhuma compra registrada.";
        cell.style.textAlign = "center";
        totalInvestidoResumo.textContent = "Total Investido: R$ 0,00";
        return;
    }

    // Agrupar compras por moeda
    const resumoCryptos = {};
    let totalGeralInvestido = 0;

    compras.forEach(compra => {
        const { moeda, quantidade, valorTotal } = compra;
        if (!resumoCryptos[moeda]) {
            resumoCryptos[moeda] = { totalQuantity: 0, totalInvestido: 0 };
        }
        resumoCryptos[moeda].totalQuantity += parseFloat(quantidade);
        resumoCryptos[moeda].totalInvestido += parseFloat(valorTotal);
        totalGeralInvestido += parseFloat(valorTotal);
    });

    Object.keys(resumoCryptos).forEach(moeda => {
        const { totalQuantity, totalInvestido } = resumoCryptos[moeda];
        const precoMedio = totalInvestido / totalQuantity;
        
        // Buscar alarme para essa moeda
        const alarmeEncontrado = alarmes.find(alarme => alarme.codigoMoeda === moeda);
        const alertaPreco = alarmeEncontrado ? parseFloat(alarmeEncontrado.valorAlvo) : (totalInvestido * 1.1);
        
        // Buscar preço atual da moeda no array global precosCriptos
        // Certifique-se de que o array precosCriptos esteja definido globalmente no updatePrices.js
        let precoAtualObj = precosCriptos.find(cripto => cripto.codigoMoeda === moeda);
        let precoAtual = precoAtualObj ? parseFloat(precoAtualObj.valorAtual) : 0;

        let row = tabelaBody.insertRow();
        row.insertCell(0).textContent = moeda;
        row.insertCell(1).textContent = totalQuantity.toFixed(6);
        row.insertCell(2).textContent = `R$ ${totalInvestido.toFixed(2)}`;
        row.insertCell(3).textContent = `R$ ${precoMedio.toFixed(2)}`;
        row.insertCell(4).textContent = `R$ ${alertaPreco.toFixed(2)}`;
        row.insertCell(5).textContent = precoAtual ? `R$ ${precoAtual.toFixed(2)}` : "N/A";
    });

    // Atualizar resumo total investido
    totalInvestidoResumo.textContent = `Total Investido: R$ ${totalGeralInvestido.toFixed(2)}`;
}
