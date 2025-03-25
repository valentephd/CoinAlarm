const somAlarme = new Audio('assets/alarme.mp3');

// Exemplo do array global de preços de criptomoedas
const precosCriptos = [
    { codigoMoeda: "BTC", valorAtual: 0 },
    { codigoMoeda: "ETH", valorAtual: 0 },
    { codigoMoeda: "LTC", valorAtual: 0 },
    { codigoMoeda: "BCH", valorAtual: 0 },
    { codigoMoeda: "DOT", valorAtual: 0 },
    { codigoMoeda: "AAVE", valorAtual: 0 }
]

window.onload = exibirAlarmes()


function exibirAlarmes() {
    const alarmes = JSON.parse(localStorage.getItem('alarmes')) || []

    const listaAlarmes = document.getElementById('listaAlarmes')
    listaAlarmes.innerHTML = ''

    // Adiciona cada alarme na lista
    alarmes.forEach(alarme => {
        const alarmeItem = document.createElement('li')
        alarmeItem.id = `alarme-${alarme.id}`
        alarmeItem.textContent = `Moeda: ${alarme.codigoMoeda}, Valor Alvo: R$ ${alarme.valorAlvo}`
        // Cria o botão de remover
        const removerBtn = document.createElement('button')
        removerBtn.textContent = 'Remover'
        removerBtn.style.marginLeft = '10px' // Espaço entre o texto e o botão
        removerBtn.onclick = () => removerAlarme(alarme.id)

        // Adiciona o botão ao item da lista
        alarmeItem.appendChild(removerBtn)

        listaAlarmes.appendChild(alarmeItem)
    });
    verificarAlarmes()
}

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
