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

    await renderComprasEVendasDetalhadas(coinName);

    const modal = document.getElementById('modalCoinDetail');
    if (modal) modal.style.display = 'flex';

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

// Função principal para processar compras e vendas e renderizar as duas tabelas
async function renderComprasEVendasDetalhadas(coinName) {
    const EPSILON = 1e-8;
    const purchases = JSON.parse(localStorage.getItem('cryptoPurchases')) || [];
    const sales = JSON.parse(localStorage.getItem('cryptoSales')) || [];
    // Mantém ordem original das compras por data
    const coinPurchases = purchases
        .filter(item => item.moeda === coinName)
        .map((item, idx) => ({
            ...item,
            _idx: idx // para manter referência original
        }));
    const coinSales = sales.filter(item => item.moeda === coinName);

    // Busca o preço atual da moeda
    let precoAtual = 0;
    if (Array.isArray(precosCriptos)) {
        const cripto = precosCriptos.find(c => c.codigoMoeda === coinName);
        if (cripto) precoAtual = cripto.valorAtual;
    }

    // Estrutura para liquidações
    // Cada compra terá: quantidadeRestante, liquidacoes: [{quantidade, valorVenda, dataVenda, observacoes, valorVendaUnitario}]
    let comprasDetalhadas = coinPurchases.map(compra => ({
        ...compra,
        quantidadeRestante: compra.quantidade,
        valorRestante: compra.valorTotal,
        liquidacoes: []
    }));

    // Cria um array auxiliar de compras para liquidação, ordenado por menor preço unitário (para liquidação ótima)
    let comprasParaLiquidar = comprasDetalhadas
        .map((compra, idx) => ({
            ...compra,
            idxOriginal: idx,
            precoUnitario: compra.valorTotal / compra.quantidade
        }));

    // Para cada venda, liquida as compras de menor preço unitário primeiro
    const vendasOrdenadas = [...coinSales].sort((a, b) => new Date(a.dataVenda) - new Date(b.dataVenda));
    vendasOrdenadas.forEach(venda => {
        let quantidadeVenda = venda.quantidade;
        let valorVendaRestante = venda.valorTotal;
        let precoVendaUnitario = venda.valorTotal / venda.quantidade;

        // Sempre liquida das compras de menor preço unitário disponíveis
        // (mas não altera a ordem de exibição das compras originais)
        comprasParaLiquidar.sort((a, b) => a.precoUnitario - b.precoUnitario);

        for (let i = 0; i < comprasParaLiquidar.length && quantidadeVenda > EPSILON; i++) {
            let compra = comprasParaLiquidar[i];
            if (compra.quantidadeRestante > EPSILON) {
                const quantidadeParaLiquidar = Math.min(compra.quantidadeRestante, quantidadeVenda);
                const valorCompraUnitario = compra.precoUnitario;
                const valorCompraParcela = quantidadeParaLiquidar * valorCompraUnitario;
                const valorVendaParcela = quantidadeParaLiquidar * precoVendaUnitario;

                // Registra a liquidação na compra original
                comprasDetalhadas[compra.idxOriginal].liquidacoes.push({
                    quantidade: quantidadeParaLiquidar,
                    valorCompra: valorCompraParcela,
                    valorVenda: valorVendaParcela,
                    dataVenda: venda.dataVenda,
                    observacoes: venda.observacoes || '',
                    valorVendaUnitario: precoVendaUnitario
                });

                comprasDetalhadas[compra.idxOriginal].quantidadeRestante -= quantidadeParaLiquidar;
                comprasDetalhadas[compra.idxOriginal].valorRestante -= valorCompraParcela;

                compra.quantidadeRestante -= quantidadeParaLiquidar;
                compra.valorRestante -= valorCompraParcela;

                quantidadeVenda -= quantidadeParaLiquidar;
                valorVendaRestante -= valorVendaParcela;
            }
        }
    });

    // Separa compras não liquidadas/parciais (restante > EPSILON)
    // e liquidações (todas as vendas parciais e totais)
    const comprasNaoLiquidadasOuParciais = comprasDetalhadas.filter(c => c.quantidadeRestante > EPSILON);
    // Para liquidações: pega todas as liquidacoes de todas as compras, inclusive parciais
    let vendasDetalhadas = [];
    comprasDetalhadas.forEach(compra => {
        compra.liquidacoes.forEach((liq, idx) => {
            vendasDetalhadas.push({
                dataCompra: compra.dataCompra,
                status: (compra.quantidadeRestante > EPSILON) ? 'Parcial' : 'Total',
                quantidade: liq.quantidade,
                valorCompra: liq.valorCompra,
                valorVenda: liq.valorVenda,
                ganhoPerda: liq.valorVenda - liq.valorCompra,
                dataVenda: liq.dataVenda,
                observacoes: liq.observacoes || ''
            });
        });
    });

    // Soma quantidade total restante para exibir no título
    const quantidadeAtual = comprasNaoLiquidadasOuParciais.reduce((acc, item) => acc + item.quantidadeRestante, 0);
    const quantidadeFormatada = quantidadeAtual.toLocaleString('pt-BR', { minimumFractionDigits: 8, maximumFractionDigits: 8 });

    // Atualiza o título do modal
    const title = document.getElementById('modalCoinDetailTitle');
    if (title) title.textContent = `${coinName} - ${quantidadeFormatada}`;

    // Renderiza as duas tabelas
    const body = document.querySelector('.modal-coin-detail-body');
    if (body) {
        body.innerHTML = `
            <div class="coin-detail-section">
                <h3>Compras Não Liquidadas ou Parciais</h3>
                <table class="coin-detail-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Quantidade</th>
                            <th>Valor (BRL)</th>
                            <th>Valor Atual (BRL)</th>
                            <th>Ganho/Perda</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comprasNaoLiquidadasOuParciais.map(compra => {
                            const valorAtualLinha = compra.quantidadeRestante * precoAtual;
                            const ganhoPerda = valorAtualLinha - compra.valorRestante;
                            let ganhoClass = 'neutro';
                            if (ganhoPerda > 0) ganhoClass = 'ganho';
                            else if (ganhoPerda < 0) ganhoClass = 'perda';
                            return `
                                <tr>
                                    <td>${compra.dataCompra ? new Date(compra.dataCompra).toLocaleDateString('pt-BR') : ''}</td>
                                    <td>${compra.quantidadeRestante === compra.quantidade ? 'Não Liquidado' : 'Parcial'}</td>
                                    <td>${compra.quantidadeRestante.toLocaleString('pt-BR', { minimumFractionDigits: 8, maximumFractionDigits: 8 })}</td>
                                    <td>R$ ${compra.valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>R$ ${valorAtualLinha.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td class="${ganhoClass}">${ganhoPerda >= 0 ? '+' : ''}R$ ${ganhoPerda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>${compra.observacoes || ''}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            <div class="coin-detail-section">
                <h3>Vendas</h3>
                <table class="coin-detail-table">
                    <thead>
                        <tr>
                            <th>Data Compra</th>
                            <th>Status</th>
                            <th>Quantidade</th>
                            <th>Valor (BRL)</th>
                            <th>Valor Vendido (BRL)</th>
                            <th>Ganho/Perda</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vendasDetalhadas.map(venda => {
                            let ganhoClass = 'neutro';
                            if (venda.ganhoPerda > 0) ganhoClass = 'ganho';
                            else if (venda.ganhoPerda < 0) ganhoClass = 'perda';
                            return `
                                <tr>
                                    <td>${venda.dataCompra ? new Date(venda.dataCompra).toLocaleDateString('pt-BR') : ''}</td>
                                    <td>${venda.status}</td>
                                    <td>${venda.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 8, maximumFractionDigits: 8 })}</td>
                                    <td>R$ ${venda.valorCompra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>R$ ${venda.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td class="${ganhoClass}">${venda.ganhoPerda >= 0 ? '+' : ''}R$ ${venda.ganhoPerda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>${venda.observacoes || ''}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}
