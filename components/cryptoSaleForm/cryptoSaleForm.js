export function populateSaleCurrencySelect() {
    let currencies = JSON.parse(localStorage.getItem("availableCurrencies"));
    if (!currencies || currencies.length === 0) {
        currencies = ["BTC", "ETH", "LTC", "BCH", "DOT", "AAVE"];
        localStorage.setItem("availableCurrencies", JSON.stringify(currencies));
    }
    const select = document.getElementById("currencySelect");
    if (!select) return; // Ensure the select element exists

    select.innerHTML = ""; // Clear the dropdown before populating

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

window.cadastrarVenda = function cadastrarVenda() {
    console.log('Chamou o cadastrar venda ....')
    const currency = document.getElementById("currencySelect").value;
    const quantityValue = document.getElementById("quantityInput").value;
    const saleDate = document.getElementById("saleDateInput").value;
    const totalValue = document.getElementById("totalValueInput").value;
    const notes = document.getElementById("notesInput").value;

    if (!currency || !quantityValue || !saleDate || !totalValue) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const quantity = parseFloat(quantityValue);
    const total = parseFloat(totalValue);

    if (isNaN(quantity) || isNaN(total)) {
        alert("Quantidade e Valor da Venda devem ser números válidos.");
        return;
    }

    const pricePerUnit = total / quantity;

    const venda = {
        id: gerarIdVenda(),
        moeda: currency,
        quantidade: quantity,
        dataVenda: saleDate,
        valorTotal: total,
        observacoes: notes,
        precoPorUnidade: pricePerUnit
    };

    console.log('Registro de venda :::', venda)

    let vendasExistentes = JSON.parse(localStorage.getItem("cryptoSales")) || [];

    console.log('[LOCAL STORAGE] cryptoSales ===> ', vendasExistentes);
    vendasExistentes.push(venda);
    localStorage.setItem("cryptoSales", JSON.stringify(vendasExistentes));

    console.log('get new localStorage cryptoSales => ', JSON.parse(localStorage.getItem("cryptoSales")))

    document.getElementById("saleResult").textContent =
        "Venda cadastrada: " + currency + ", " + quantity + " unidades, valor total R$ " + total.toFixed(2) +
        ", preço por unidade R$ " + pricePerUnit.toFixed(2);

    document.getElementById("saleForm").reset();
}

function gerarIdVenda() {
    let vendasExistentes = JSON.parse(localStorage.getItem("cryptoSales")) || [];
    return vendasExistentes.length ? vendasExistentes[vendasExistentes.length - 1].id + 1 : 1;
}

// Populate the currency select dropdown when the script is loaded
document.addEventListener("DOMContentLoaded", populateSaleCurrencySelect);
