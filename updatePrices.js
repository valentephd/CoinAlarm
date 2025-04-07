/// TODO: Usar a API do Mercado Bitcoin: https://api.mercadobitcoin.net/api/v4/docs#tag/Public-Data/paths/~1symbols/get
/// https://api.mercadobitcoin.net/api/v4/symbols


// URL da API para consultar os preços
const API_URL = 'https://economia.awesomeapi.com.br/json/last/';

// Função para buscar os preços de moedas
function atualizarPrecos() {
    precosCriptos.forEach(function(cripto) {
        getPrecoBRL(cripto.codigoMoeda)
    });
}

async function getPrecoBRL(codigoMoeda){
    console.log('Pegando preco da ==> ', codigoMoeda)
    const codigoMoedaToBRL = codigoMoeda + '-BRL'

    try {
        const response = await fetch(`${API_URL}${codigoMoedaToBRL}`);
        const data = await response.json();

        // Atualiza o valor da Cripto
        const codeCoinBRL = codigoMoeda + 'BRL'

        console.log('data[COIN] ==> ', data[codeCoinBRL].bid)

        console.log('Atualizando a moeda ', codigoMoeda)
        let cripto = precosCriptos.find(cripto => cripto.codigoMoeda === codigoMoeda);
        if(cripto) {
            cripto.valorAtual = parseFloat(data[codeCoinBRL].bid)
            console.log('Atualizada com sucesso.')
        }
        
        console.log('')
        console.log('')
        console.log('')

        // Após atualizar os preços, verifica os alarmes
        verificarAlarmes();
        
    } catch (error) {
        console.error('Erro ao atualizar preços:', error);
    }
}

// Atualiza os preços a cada minuto
setInterval(atualizarPrecos, 60000);

// Atualiza os preços ao carregar o script
atualizarPrecos();
