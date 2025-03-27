// Função para popular o select de moedas dinamicamente
function populateCurrencySelect() {
    let currencies = JSON.parse(localStorage.getItem("availableCurrencies"));
    if (!currencies) {
      currencies = ["BTC", "ETH", "LTC", "BCH", "DOT", "AAVE"];
      localStorage.setItem("availableCurrencies", JSON.stringify(currencies));
    }
    const select = document.getElementById("currencySelect");
    select.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Escolha uma moeda";
    select.appendChild(defaultOption);
    currencies.forEach(currency => {
      const option = document.createElement("option");
      option.value = currency;
      option.textContent = currency;
      select.appendChild(option);
    });
  }
  
  function cadastrarCompra() {
    const currency = document.getElementById('currencySelect').value;
    const quantityValue = document.getElementById('quantityInput').value;
    const purchaseDate = document.getElementById('purchaseDateInput').value;
    const totalValue = document.getElementById('totalValueInput').value;
    const notes = document.getElementById('notesInput').value;
    
    if (!currency || !quantityValue || !purchaseDate || !totalValue) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    
    const quantity = parseFloat(quantityValue);
    const total = parseFloat(totalValue);
    
    if (isNaN(quantity) || isNaN(total)) {
      alert("Quantidade e Valor da Compra devem ser números válidos.");
      return;
    }
    
    const pricePerUnit = total / quantity;
    
    const compra = {
      id: gerarIdCompra(),
      moeda: currency,
      quantidade: quantity,
      dataCompra: purchaseDate,
      valorTotal: total,
      observacoes: notes,
      precoPorUnidade: pricePerUnit
    };
    
    let comprasExistentes = JSON.parse(localStorage.getItem('cryptoPurchases')) || [];
    comprasExistentes.push(compra);
    localStorage.setItem('cryptoPurchases', JSON.stringify(comprasExistentes));
    
    document.getElementById('purchaseResult').textContent = 
      "Compra cadastrada: " + currency + ", " + quantity + " unidades, valor total R$ " + total.toFixed(2) +
      ", preço por unidade R$ " + pricePerUnit.toFixed(2);
    
    document.getElementById('purchaseForm').reset();
  }
  
  function gerarIdCompra() {
    let comprasExistentes = JSON.parse(localStorage.getItem('cryptoPurchases')) || [];
    return comprasExistentes.length ? comprasExistentes[comprasExistentes.length - 1].id + 1 : 1;
  }
  
  // Chama a função para popular o select assim que o script for carregado
  populateCurrencySelect();
  