function abrirModalCompras(moeda) {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modalContainer';
  document.body.appendChild(modalContainer);

  fetch('components/cryptoPurchasesModal.html')
    .then(response => response.text())
    .then(modalHTML => {
      modalContainer.innerHTML = modalHTML;
      document.getElementById('modalMoedaNome').textContent = moeda;
      document.getElementById('modalCompras').style.display = 'block';
      document.body.classList.add('modal-open'); // Add class to body
      carregarComprasModal(moeda);
    });
}

function fecharModalCompras() {
  const modalContainer = document.getElementById('modalContainer');
  if (modalContainer) {
    modalContainer.remove();
    document.body.classList.remove('modal-open'); // Remove class from body
  }
}

function carregarComprasModal(moeda) {
  const compras = JSON.parse(localStorage.getItem('cryptoPurchases')) || [];
  const comprasFiltradas = compras.filter(compra => compra.moeda === moeda);

  const tbody = document.querySelector('#comprasTable tbody');
  tbody.innerHTML = '';

  if (comprasFiltradas.length === 0) {
    const row = tbody.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 6; // Adjusted for new columns
    cell.textContent = 'Nenhuma compra registrada para esta moeda.';
    cell.style.textAlign = 'center';
    return;
  }

  // Get the current price of the cryptocurrency
  const precoAtualObj = precosCriptos.find(cripto => cripto.codigoMoeda === moeda);
  const precoAtual = precoAtualObj ? parseFloat(precoAtualObj.valorAtual) : 0;

  let totalQuantidade = 0;
  let totalValorAtual = 0;

  comprasFiltradas.forEach(compra => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = compra.dataCompra;
    row.insertCell(1).textContent = compra.quantidade.toFixed(6).replace('.', ',');
    row.insertCell(2).textContent = `R$ ${compra.valorTotal.toFixed(2).replace('.', ',')}`;

    // Add current value column
    const valorAtual = precoAtual * compra.quantidade;
    totalQuantidade += compra.quantidade;
    totalValorAtual += valorAtual;
    row.insertCell(3).textContent = precoAtual ? `R$ ${valorAtual.toFixed(2).replace('.', ',')}` : 'N/A';

    // Add gain/loss column with arrow only
    const gainLoss = valorAtual - compra.valorTotal;
    const gainLossPercent = compra.valorTotal ? (gainLoss / compra.valorTotal) * 100 : 0;
    const gainLossCell = row.insertCell(4);
    if (precoAtual) {
      if (gainLoss > 0) {
        gainLossCell.innerHTML = `<span style="color: blue;">⬆️</span> +R$ ${gainLoss.toFixed(2).replace('.', ',')} (+${gainLossPercent.toFixed(2).replace('.', ',')}%)`;
      } else if (gainLoss < 0) {
        gainLossCell.innerHTML = `<span class="gain-loss-arrow-down">⬇️</span> -R$ ${Math.abs(gainLoss).toFixed(2).replace('.', ',')} (${gainLossPercent.toFixed(2).replace('.', ',')}%)`;
      } else {
        gainLossCell.innerHTML = `R$ 0,00 (0,00%)`;
      }
    } else {
      gainLossCell.textContent = 'N/A';
    }

    row.insertCell(5).textContent = compra.observacoes || '-';
  });

  // Update modal title with total quantity and current total value
  document.getElementById('modalMoedaQuantidade').textContent = totalQuantidade.toFixed(6).replace('.', ',');
  document.getElementById('modalMoedaValorAtual').textContent = totalValorAtual.toFixed(2).replace('.', ',');
}
