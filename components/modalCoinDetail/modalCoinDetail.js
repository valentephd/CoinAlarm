import { precosCriptos } from '../../app.js';

export async function renderModalCoinDetail(coinName) {
    // Carrega o HTML do modal
    const container = document.getElementById('modalCoinDetailContent');
    if (!container) return;
    const response = await fetch('components/modalCoinDetail/modalCoinDetail.html');
    const html = await response.text();
    container.innerHTML = html;

    // Garante que o CSS está carregado (opcional, se não estiver no index.html)
    if (!document.getElementById('modalCoinDetailCSS')) {
        const link = document.createElement('link');
        link.id = 'modalCoinDetailCSS';
        link.rel = 'stylesheet';
        link.href = 'components/modalCoinDetail/modalCoinDetail.css';
        document.head.appendChild(link);
    }

    // Processa as transações e monta a tabela
    await renderCoinTransactionsTable(coinName);

    // Exibe o modal
    const modal = document.getElementById('modalCoinDetail');
    if (modal) modal.style.display = 'flex';

    // Adiciona eventos de fechar
    const closeBtn = document.getElementById('modalCoinDetailCloseBtn');
    if (closeBtn) closeBtn.onclick = closeModalCoinDetail;
    window.onclick = function(event) {
        if (event.target === modal) closeModalCoinDetail();
    };
}

export function closeModalCoinDetail() {
    const modal = document.getElementById('modalCoinDetail');
    if (modal) modal.style.display = 'none';
    const container = document.getElementById('modalCoinDetailContent');
    if (container) container.innerHTML = '';
}

async function renderCoinTransactionsTable(coinName) {
    const purchases = JSON.parse(localStorage.getItem('cryptoPurchases')) || [];
    const sales = JSON.parse(localStorage.getItem('cryptoSales')) || [];
    const coinPurchases = purchases.filter(item => item.moeda === coinName);
    const coinSales = sales.filter(item => item.moeda === coinName);

    // Ordena por data (compras e vendas)
    coinPurchases.sort((a, b) => new Date(a.dataCompra) - new Date(b.dataCompra));
    coinSales.sort((a, b) => new Date(a.dataVenda) - new Date(b.dataVenda));

    // Busca o preço atual da moeda
    let precoAtual = 0;
    if (Array.isArray(precosCriptos)) {
        const cripto = precosCriptos.find(c => c.codigoMoeda === coinName);
        if (cripto) precoAtual = cripto.valorAtual;
    }

    // Monta lista de transações (compras e vendas) individualmente
    const transacoes = [
        ...coinPurchases.map(item => ({
            tipo: 'Compra',
            data: item.dataCompra,
            quantidade: item.quantidade,
            valor: item.valorTotal,
            observacoes: item.observacoes || '',
            precoPorUnidade: item.precoPorUnidade
        })),
        ...coinSales.map(item => ({
            tipo: 'Venda',
            data: item.dataVenda,
            quantidade: item.quantidade,
            valor: item.valorTotal,
            observacoes: item.observacoes || '',
            precoPorUnidade: item.precoPorUnidade
        }))
    ];

    // Ordena todas as transações por data
    transacoes.sort((a, b) => new Date(a.data) - new Date(b.data));

    // Formata quantidade total para exibir no título
    const totalComprado = coinPurchases.reduce((acc, item) => acc + item.quantidade, 0);
    const totalVendido = coinSales.reduce((acc, item) => acc + item.quantidade, 0);
    const quantidadeAtual = totalComprado - totalVendido;
    const quantidadeFormatada = quantidadeAtual.toLocaleString('pt-BR', { minimumFractionDigits: 8, maximumFractionDigits: 8 });

    // Atualiza o título do modal
    const title = document.getElementById('modalCoinDetailTitle');
    if (title) title.textContent = `${coinName} - ${quantidadeFormatada}`;

    // Renderiza as linhas no tbody da tabela
    const tbody = document.getElementById('coinDetailTableBody');
    if (tbody) {
        tbody.innerHTML = transacoes.map(tx => {
            // Valor atual da linha: quantidade * precoAtual (compra positiva, venda negativa)
            const quantidadeLinha = tx.tipo === 'Compra' ? tx.quantidade : -tx.quantidade;
            const valorAtualLinha = quantidadeLinha * precoAtual;
            // Ganho/perda: para compra, valorAtualLinha - valor investido; para venda, valor da venda - valor investido (considerando só a linha)
            let ganhoPerda = 0;
            if (tx.tipo === 'Compra') {
                ganhoPerda = valorAtualLinha - tx.valor;
            } else {
                ganhoPerda = tx.valor - (tx.quantidade * tx.precoPorUnidade);
            }
            let ganhoClass = 'neutro';
            if (ganhoPerda > 0) ganhoClass = 'ganho';
            else if (ganhoPerda < 0) ganhoClass = 'perda';
            return `
                <tr>
                    <td>${tx.data ? new Date(tx.data).toLocaleDateString('pt-BR') : ''}</td>
                    <td>${tx.tipo}</td>
                    <td>${tx.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 8, maximumFractionDigits: 8 })}</td>
                    <td>R$ ${tx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>R$ ${valorAtualLinha.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td class="${ganhoClass}">${ganhoPerda >= 0 ? '+' : ''}R$ ${ganhoPerda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${tx.observacoes}</td>
                </tr>
            `;
        }).join('');
    }
}
