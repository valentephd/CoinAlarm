import { precosCriptos } from './app.js';
import { renderDashboard } from './components/dashboard/dashboard.js';

export function updatePrices(){
    console.log('updatePrices sendo chamado aqui....')

    document.addEventListener("DOMContentLoaded", function () {
        console.log('DOMContentLoaded ....')
        atualizarPrecos();
        document.getElementById("atualizarTabelaBtn").addEventListener("click", atualizarPrecos);
    });    
}

function atualizarPrecos() {
    console.log('updatePrices .... in atualizarPrecos')
    // Obtém lista de códigos de moedas do localStorage
    const currencies = JSON.parse(localStorage.getItem('availableCurrencies')) || [];
    if (!Array.isArray(currencies) || currencies.length === 0) {
        console.warn('Nenhuma moeda disponível para atualização de preços.');
        return;
    }

    // Reconstrói o array global com valorInicial zero
    var precosCriptos = currencies.map(code => ({ codigoMoeda: code, valorAtual: 0 }));

    const promises = precosCriptos.map(cripto => getPrecoBRL(cripto.codigoMoeda));
    
    // Aguarda todas as promessas serem resolvidas
    Promise.all(promises).then(() => {
        // Atualiza a tabela após todos os preços serem carregados
        if (typeof atualizarTabelaCryptos === 'function') {
            atualizarTabelaCryptos();
        }
    });
}

// Busca o preço da moeda na API do Mercado Bitcoin
async function getPrecoBRL(codigoMoeda) {
    const API_URL = 'https://api.mercadobitcoin.net/api/v4/tickers?symbols[]=';
    const url = `${API_URL}${codigoMoeda}-BRL`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        // data é array; pegamos o primeiro elemento
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Resposta vazia ou formato inesperado');
        }

        const ticker = data[0];
        const lastPrice = parseFloat(ticker.last);

        // Atualiza o array global
        const cripto = precosCriptos.find(c => c.codigoMoeda === codigoMoeda);
        if (cripto) {
            cripto.valorAtual = lastPrice;
        }

        // Chama verificação de alarmes, se definida
        if (typeof verificarAlarmes === 'function') {
            verificarAlarmes();
        }
        
        console.log('Renderizando dashboard... ');
        renderDashboard();
    } catch (error) {
        console.error(`❌ Erro ao buscar ${codigoMoeda}-BRL:`, error);
    }
}

// Chama atualizarPrecos() assim que a página carregar e dispara o intervalo
document.addEventListener('DOMContentLoaded', () => {
    atualizarPrecos();
    setInterval(atualizarPrecos, 300 * 1000);
    console.log('Hora ===>>> ', new Date())
});