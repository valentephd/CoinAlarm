import { precosCriptos, dashboardData } from '../../app.js';

export function renderDashboard() {
    try {
        const tabelaBody = document.querySelector("#cryptoTable tbody");
        if (!tabelaBody) {
            console.error("Tabela não encontrada no DOM.");
            return;
        }

        const totalInvestidoResumo = document.getElementById("totalInvestidoResumo");
        const totalValorAtualResumo = document.getElementById("totalValorAtualResumo");
        tabelaBody.innerHTML = "";

        if (dashboardData.length === 0) {
            let row = tabelaBody.insertRow();
            let cell = row.insertCell(0);
            cell.colSpan = 8;
            cell.textContent = "Nenhuma compra registrada.";
            cell.style.textAlign = "center";
            totalInvestidoResumo.textContent = "Total Investido: R$ 0,00";
            totalValorAtualResumo.textContent = "Valor Atual: R$ 0,00";
            return;
        }

        let totalGeralInvestido = 0;
        let totalValorAtual = 0;

        dashboardData.forEach(data => {
            const { moeda, quantidade, valorTotalInvestido, valorAtual, precoMedio, precoAtual, alertaPreco, ganhoPerda } = data;

            totalGeralInvestido += valorTotalInvestido;
            totalValorAtual += valorAtual;

            let row = tabelaBody.insertRow();
            const moedaCell = row.insertCell(0);
            moedaCell.innerHTML = `<a href="#" onclick="abrirModalCompras('${moeda}')">${moeda}</a>`;
            row.insertCell(1).textContent = quantidade.toFixed(6);
            row.insertCell(2).textContent = `R$ ${valorTotalInvestido.toFixed(2)}`;
            row.insertCell(3).textContent = `R$ ${valorAtual.toFixed(2)}`;
            row.insertCell(4).textContent = `R$ ${precoMedio.toFixed(2)}`;
            row.insertCell(5).textContent = precoAtual ? `R$ ${precoAtual.toFixed(2)}` : "N/A";
            row.insertCell(6).textContent = `R$ ${alertaPreco.toFixed(2)}`;
            row.insertCell(7).textContent = ganhoPerda;
        });

        // Atualizar resumo total investido e valor atual
        totalInvestidoResumo.textContent = `Total Investido: R$ ${totalGeralInvestido.toFixed(2)}`;
        totalValorAtualResumo.textContent = `Valor Total Atual: R$ ${totalValorAtual.toFixed(2)}`;
    } catch (error) {
        console.log("Erro ao renderizar o dashboard:", error);
    }
}
