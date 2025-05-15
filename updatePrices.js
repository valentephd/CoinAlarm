import { precosCriptos, tableOverviewCoins } from './app.js';
import { renderDashboard } from './components/dashboard/dashboard.js';

export async function updatePrices() {
    console.log('Hora ===>>> ', new Date())
    console.log('updatePrices .....')
    // Obtém lista de códigos de moedas do localStorage
    const currencies = JSON.parse(localStorage.getItem('availableCurrencies')) || [];
    if (!Array.isArray(currencies) || currencies.length === 0) {
        console.warn('Nenhuma moeda disponível para atualização de preços.');
        return;
    }

    
    await precosCriptos.map(cripto => getPrecoBRL(cripto.codigoMoeda))
    //console.log('precosCriptos in updatePrices ===> ', precosCriptos)
    const novosValores = Array.from(precosCriptos)
    //console.log('novosValores in updatePrices ===> ',  novosValores)
    tableOverviewCoins(novosValores);
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
        
    } catch (error) {
        console.error(`❌ Erro ao buscar ${codigoMoeda}-BRL:`, error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(updatePrices, 30 * 1000);
});