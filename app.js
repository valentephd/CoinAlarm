import { renderDashboard } from './components/dashboard/dashboard.js';
import { updatePrices } from './updatePrices.js';

const somAlarme = new Audio('assets/alarme.mp3');

export var precosCriptos = [
    { codigoMoeda: "BTC", valorAtual: 0 },
    { codigoMoeda: "ETH", valorAtual: 0 },
    { codigoMoeda: "LTC", valorAtual: 0 },
    { codigoMoeda: "BCH", valorAtual: 0 },
    { codigoMoeda: "DOT", valorAtual: 0 },
    { codigoMoeda: "AAVE", valorAtual: 0 }
];

// Inicializar a aplicação
window.onload = async () => {
    await updatePrices();
    // console.log('Vai aguardar 0,5 segundo para executar o resto do onload')
    setTimeout(() => {
        carregarComponentesFixos();
        carregarConteudo('dashboard');
    }, 500);

    
};

// Carregar componentes fixos (header, menu, footer)
function carregarComponentesFixos() {
    fetch('components/header/header.html')
        .then(response => response.text())
        .then(html => document.getElementById('header').innerHTML = html);

    fetch('components/menu/menu.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('menu').innerHTML = html;
            const script = document.createElement('script');
            script.src = 'components/menu/menu.js';
            document.body.appendChild(script);
        });

    fetch('components/footer/footer.html')
        .then(response => response.text())
        .then(html => document.getElementById('footer').innerHTML = html);
}

// Gerenciar a navegação e carregar o conteúdo dinâmico
function carregarConteudo(route) {
    const path = `components/${route}/${route}.html`;
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o componente: ${route}`);
            }
            return response.text();
        })
        .then(html => {
            const content = document.getElementById('content');
            content.style.display = 'block'; // Garantir que o conteúdo seja exibido
            content.innerHTML = html;

            if (route === 'dashboard') {
                // Aguarde o carregamento do HTML antes de executar o JS
                renderDashboard();
            }
        })
        .catch(error => {
            console.error(error);
            document.getElementById('content').innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
        });
}


/* OLD FUNCTION
function cadastrarAlarme() {
    const codeCripto = document.getElementById('codeCripto').value
    const targetValue = document.getElementById('targetValue').value

    console.log("Moeda: ", codeCripto)
    console.log("Valor Alvo (BRL): ", targetValue)

    if(!codeCripto || !targetValue){
        alert("Preencha todos os campos para gerar o alarme !")
        return
    }

    const alarme = {
        id: gerarIdSequencial(),
        codigoMoeda: codeCripto,
        valorAlvo: targetValue
    }

    const alarmesExistentes = JSON.parse(localStorage.getItem('alarmes')) || []
    alarmesExistentes.push(alarme)
    localStorage.setItem('alarmes', JSON.stringify(alarmesExistentes))
    console.log("Alarme cadastrado:", alarme)
    alert(`Alarme para ${codeCripto} com valor de R$ ${targetValue} cadastrado com sucesso!`)
    exibirAlarmes()
}


function gerarIdSequencial() {
    const alarmesExistentes = JSON.parse(localStorage.getItem('alarmes')) || []
    return alarmesExistentes.length ? alarmesExistentes[alarmesExistentes.length - 1].id + 1 : 1
}

function removerAlarme(id) {
    const alarmesExistentes = JSON.parse(localStorage.getItem('alarmes')) || []
    const alarmesAtualizados = alarmesExistentes.filter(alarme => alarme.id !== id)
    localStorage.setItem('alarmes', JSON.stringify(alarmesAtualizados))
    exibirAlarmes()
}
    */

// Função para verificar se algum alarme foi atingido
function verificarAlarmes() {
    const alarmes = JSON.parse(localStorage.getItem('alarmes')) || [];

    // Itera sobre os alarmes e verifica o preço atual de cada moeda
    alarmes.forEach(alarme => {
        const precoCripto = precosCriptos.find(cripto => cripto.codigoMoeda === alarme.codigoMoeda);

        if (precoCripto) {
            const alarmeItem = document.getElementById(`alarme-${alarme.id}`);
            if (alarmeItem) {
                // Verifica se já existe um <span> no alarme
                let simbolo = alarmeItem.querySelector('span');

                if (!simbolo) {
                    // Se o <span> não existe, cria um
                    simbolo = document.createElement('span');
                    simbolo.style.marginLeft = '10px'; // Espaço entre o texto e o símbolo
                    alarmeItem.appendChild(simbolo);
                }

                // Atualiza a cor do <span> com base na condição
                if (precoCripto.valorAtual >= alarme.valorAlvo) {
                    simbolo.textContent = '●';
                    simbolo.style.color = 'green';
                    console.log(`Alarme atingido para ${alarme.codigoMoeda}. Valor atual: R$ ${precoCripto.valorAtual} é maior que o valor alvo esperado: R$ ${alarme.valorAlvo}`);
                    somAlarme.play();
                } else {
                    simbolo.textContent = '●';
                    simbolo.style.color = 'gray';
                }

                // Atualiza o texto do alarme com o preço atual
                alarmeItem.firstChild.textContent = `Moeda: ${alarme.codigoMoeda}, Valor Alvo: R$ ${alarme.valorAlvo}, Valor Atual: R$ ${precoCripto.valorAtual}`;
            }
        }
    });
}

export const dashboardData = [];

export async function tableOverviewCoins(valoresCriptosAtualizados) {
    console.log('Executando tableOverviewCoins .....')
    setTimeout(() => {
        const cryptoPurchases = JSON.parse(localStorage.getItem('cryptoPurchases')) || [];
        //console.log('cryptoPurchases ==> ', cryptoPurchases);
        const cryptoSales = JSON.parse(localStorage.getItem('cryptoSales')) || [];
        //console.log('cryptoSales ==> ', cryptoSales);

        // Cria um set com os códigos das moedas
        const setCodigoMoedas = new Set();
        cryptoPurchases.map(item => {
            let codigoMoeda = item['moeda'];
            setCodigoMoedas.add(codigoMoeda);
        });

        setCodigoMoedas.forEach( moeda => {
            //console.log(moeda)

            const compras = cryptoPurchases.filter(item => item.moeda == moeda)
            const vendas = cryptoSales.filter(item => item.moeda == moeda)
            //console.log('compras ::: ', compras)
            //console.log('vendas ::: ', vendas)

            // Colunas do dashboard
            let quantidade = 0
            let valorTotalInvestido = 0
            let valorAtualizadoMoeda = 0

            // Quantidade de cada Moeda (compras - vendas)
            quantidade += compras.reduce((acc, item) => acc + item.quantidade, 0)
            quantidade -= vendas.reduce((acc, item) => acc + item.quantidade, 0)

            // Valor Total de Cada Moeda (compras - vendas)
            valorTotalInvestido += compras.reduce((acc, item) => acc + item.valorTotal, 0)
            valorTotalInvestido -= vendas.reduce((acc, item) => acc + item.valorTotal, 0)

            // Define Valor Atual (quantidade de moeda x precosCripto) para cada Moeda
            let precoCripto = valoresCriptosAtualizados.find( item => item.codigoMoeda == moeda)
            valorAtualizadoMoeda = precoCripto.valorAtual
            let valorAtual = quantidade * valorAtualizadoMoeda

            // Define o preço médio baseado na quantidade atual de moeda e o valor de compra que restou (precisa subitrair do que foi vendido)
            let quantidadeRestante = quantidade;
            let valorRestante = 0;

            // Ordena as compras por ordem de registro (FIFO - Primeiro a entrar, primeiro a sair)
            compras.sort((a, b) => a.data - b.data);

            for (const compra of compras) {
                if (quantidadeRestante <= 0) break;

                const quantidadeConsiderada = Math.min(compra.quantidade, quantidadeRestante);
                valorRestante += quantidadeConsiderada * (compra.valorTotal / compra.quantidade);
                quantidadeRestante -= quantidadeConsiderada;
            }

            const precoMedio = quantidade > 0 ? valorRestante / quantidade : 0;

            const gainLoss = valorAtual - valorTotalInvestido;
            const gainLossPercent = valorTotalInvestido ? (gainLoss / valorTotalInvestido) * 100 : 0;

            const ganhoPerda = !valorAtualizadoMoeda 
                ? "N/A" 
                : (gainLoss > 0 
                    ? `+R$ ${gainLoss.toFixed(2)} (+${gainLossPercent.toFixed(2)}%)` 
                    : gainLoss < 0 
                        ? `-R$ ${Math.abs(gainLoss).toFixed(2)} (${gainLossPercent.toFixed(2)}%)` 
                        : `R$ 0.00 (0.00%)`);

            const data = {
                "moeda": moeda,
                "quantidade": quantidade,
                "valorTotalInvestido": valorTotalInvestido,
                "valorAtual": Number.parseFloat(valorAtual.toFixed(2)),
                "precoMedio": Number.parseFloat(precoMedio.toFixed(2)),
                "precoAtual": precoCripto.valorAtual,
                "alertaPreco": Number.parseFloat((precoCripto.valorAtual * 1.1).toFixed(2)),
                "ganhoPerda": ganhoPerda
            };
            dashboardData.push(data);

        })

        console.log('dashboardData ====> ', dashboardData);
    }, 800);

    renderDashboard()
}

