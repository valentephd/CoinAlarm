function atualizarTabelaCryptos() {
    console.log("atualizarTabelaCryptos ...");
    try{
        const tabelaBody = document.querySelector("#cryptoTable tbody");
        const totalInvestidoResumo = document.getElementById("totalInvestidoResumo");
        const totalValorAtualResumo = document.getElementById("totalValorAtualResumo");
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
            totalValorAtualResumo.textContent = "Valor Atual: R$ 0,00";
            return;
        }

        // Agrupar compras por moeda
        const resumoCryptos = {};
        let totalGeralInvestido = 0;
        let totalValorAtual = 0;

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
            let precoAtualObj = precosCriptos.find(cripto => cripto.codigoMoeda === moeda);
            let precoAtual = precoAtualObj ? parseFloat(precoAtualObj.valorAtual) : 0;
            
            const valorAtual = precoAtual * totalQuantity;
            totalValorAtual += valorAtual;
            
            const gainLoss = valorAtual - (precoMedio * totalQuantity);
            const gainLossPercent = (precoMedio * totalQuantity) ? (gainLoss / (precoMedio * totalQuantity)) * 100 : 0;
            let gainLossText = !precoAtual ? "N/A" : (gainLoss > 0 ? `+R$ ${gainLoss.toFixed(2)} (+${gainLossPercent.toFixed(2)}%)` : gainLoss < 0 ? `-R$ ${Math.abs(gainLoss).toFixed(2)} (${gainLossPercent.toFixed(2)}%)` : `R$ 0.00 (0.00%)`);

            let row = tabelaBody.insertRow();
            row.insertCell(0).textContent = moeda;
            row.insertCell(1).textContent = totalQuantity.toFixed(6);
            row.insertCell(2).textContent = `R$ ${totalInvestido.toFixed(2)}`;
            row.insertCell(3).textContent = `R$ ${valorAtual.toFixed(2)}`;
            row.insertCell(4).textContent = `R$ ${precoMedio.toFixed(2)}`;
            row.insertCell(5).textContent = `R$ ${alertaPreco.toFixed(2)}`;
            row.insertCell(6).textContent = precoAtual ? `R$ ${precoAtual.toFixed(2)}` : "N/A";
            row.insertCell(7).textContent = gainLossText;
        });

        // Atualizar resumo total investido
        totalInvestidoResumo.textContent = `Total Investido: R$ ${totalGeralInvestido.toFixed(2)}`;
        let diferencaTotal = totalValorAtual - totalGeralInvestido;
        totalValorAtualResumo.textContent = `Valor Total Atual: R$ ${totalValorAtual.toFixed(2)}`;
        let porcentagemDiferenca = totalGeralInvestido ? (diferencaTotal / totalGeralInvestido) * 100 : 0;

        if(diferencaTotal > 0) {
            ganhoPerdaResumo.textContent = `Ganho: R$ ${diferencaTotal.toFixed(2)}`;
            ganhoPerdaResumo.textContent += ` (${porcentagemDiferenca.toFixed(2)}%)`;
            ganhoPerdaResumo.style.color = "green";
        } else if(diferencaTotal < 0) {
            ganhoPerdaResumo.textContent = `Perda: R$ ${diferencaTotal.toFixed(2)}`;
            ganhoPerdaResumo.textContent += ` (${porcentagemDiferenca.toFixed(2)}%)`;
            ganhoPerdaResumo.style.color = "red";
        } else {
            ganhoPerdaResumo.textContent = `R$ ${diferencaTotal.toFixed(2)}`;
            ganhoPerdaResumo.textContent += ` (${porcentagemDiferenca.toFixed(2)}%)`;
            ganhoPerdaResumo.style.color = "black";
        }
    } catch (error) {
        console.log("Erro:", error);
    }
}
