console.log('updatePrices ....')

document.addEventListener("DOMContentLoaded", function () {
    console.log('DOMContentLoaded ....')
    atualizarPrecos();
    document.getElementById("atualizarTabelaBtn").addEventListener("click", atualizarPrecos);
});


// updatePrices.js
// Usa a API v4 do Mercado Bitcoin para atualizar preços dinamicamente
// Mantém a estrutura original de chamar atualizarPrecos() periodicamente

// Base da API
const API_URL = 'https://api.mercadobitcoin.net/api/v4/tickers?symbols[]=';

// Array global que será reconstruído a cada chamada, conforme moedas disponíveis
//var precosCriptos = [];

// Função principal: carrega moedas e dispara buscas individuais
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

// Chama atualizarPrecos() assim que a página carregar e dispara o intervalo
document.addEventListener('DOMContentLoaded', () => {
    atualizarPrecos();
    setInterval(atualizarPrecos, 60 * 1000);
});