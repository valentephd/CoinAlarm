import { precosCriptos, dashboardData } from '../../app.js';
import { renderModalCoinDetail } from '../modalCoinDetail/modalCoinDetail.js';

export function renderDashboard() {
    console.log('Chamou o dashboard')
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
            // Altera o link para não redirecionar e apenas abrir o modal
            moedaCell.innerHTML = `<a href="#" class="coin-link">${moeda}</a>`;
            row.insertCell(1).textContent = quantidade.toFixed(8);
            row.insertCell(2).textContent = `R$ ${valorTotalInvestido.toFixed(2)}`;
            row.insertCell(3).textContent = `R$ ${valorAtual.toFixed(2)}`;
            row.insertCell(4).textContent = `R$ ${precoMedio.toFixed(2)}`;
            row.insertCell(5).textContent = precoAtual ? `R$ ${precoAtual.toFixed(2)}` : "N/A";
            row.insertCell(6).textContent = `R$ ${alertaPreco.toFixed(2)}`;
            
            // Ganho/Perda com seta e cor
            const ganhoPerdaCell = row.insertCell(7);
            let valorGanhoPerda = typeof ganhoPerda === "number" ? ganhoPerda : parseFloat(ganhoPerda.replace(/[^\d.-]/g, ''));
            if (valorGanhoPerda > 0) {
                ganhoPerdaCell.innerHTML = `<span class="arrow-up">▲</span> R$ ${valorGanhoPerda.toFixed(2)}`;
            } else if (valorGanhoPerda < 0) {
                ganhoPerdaCell.innerHTML = `<span class="arrow-down">▼</span> R$ ${valorGanhoPerda.toFixed(2)}`;
            } else {
                ganhoPerdaCell.innerHTML = `<span>R$ ${valorGanhoPerda.toFixed(2)}</span>`;
            }
        });

        // Atualizar resumo total investido e valor atual
        //totalInvestidoResumo.textContent = `Total Investido: R$ ${totalGeralInvestido.toFixed(2)}`;
        //totalValorAtualResumo.textContent = `Valor Total Atual: R$ ${totalValorAtual.toFixed(2)}`;



        // Atualizar resumo total investido
        totalInvestidoResumo.textContent = `Total Investido: R$ ${totalGeralInvestido.toFixed(2)}`;
        let diferencaTotal = totalValorAtual - totalGeralInvestido;
        totalValorAtualResumo.textContent = `Valor Total Atual: R$ ${totalValorAtual.toFixed(2)}`;
        let porcentagemDiferenca = totalGeralInvestido ? (diferencaTotal / totalGeralInvestido) * 100 : 0;


        ganhoPerdaResumo.textContent = (diferencaTotal > 0) ? 
            'Ganho: R$ $' + diferencaTotal.toFixed(2)
            :
            (diferencaTotal < 0) ?
                'Perda: R$ $' + diferencaTotal.toFixed(2)
                :
                'R$ $' + diferencaTotal.toFixed(2)
        ganhoPerdaResumo.textContent += ` (${porcentagemDiferenca.toFixed(2)}%)`;
        ganhoPerdaResumo.style.color = (diferencaTotal > 0) ? "blue" : (diferencaTotal < 0) ? "red" : "black";

        // Adiciona o event listener para todos os links de moeda
        setTimeout(() => {
            document.querySelectorAll('.coin-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    openDashboardCoin(this.textContent);
                });
            });
        }, 0);

    } catch (error) {
        console.log("Erro ao renderizar o dashboard:", error);
    }
}

function openDashboardCoin(moeda){
    console.log('Moeda: ==> ', moeda);
    // Carrega o modal
    renderModalCoinDetail(moeda);
}

window.openDashboardCoin = openDashboardCoin;
