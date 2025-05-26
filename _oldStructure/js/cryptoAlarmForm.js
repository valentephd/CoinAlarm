function populateAlarmCurrencySelect() {
  let currencies = JSON.parse(localStorage.getItem("availableCurrencies"));
  if (!currencies) {
    currencies = ["BTC", "ETH", "LTC", "BCH", "DOT", "AAVE"];
    localStorage.setItem("availableCurrencies", JSON.stringify(currencies));
  }
  const select = document.getElementById("alarmCurrencySelect");
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

function cadastrarAlarme() {
  const currency = document.getElementById("alarmCurrencySelect").value;
  const targetValueRaw = document.getElementById("targetValueInput").value;
  
  if (!currency || !targetValueRaw) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }
  
  const targetValue = parseFloat(targetValueRaw);
  if (isNaN(targetValue)) {
    alert("Valor Alvo deve ser um número válido.");
    return;
  }
  
  const alarme = {
    id: gerarIdAlarme(),
    codigoMoeda: currency,
    valorAlvo: targetValue
  };
  
  let alarmesExistentes = JSON.parse(localStorage.getItem("alarmes")) || [];
  alarmesExistentes.push(alarme);
  localStorage.setItem("alarmes", JSON.stringify(alarmesExistentes));
  
  document.getElementById("alarmResult").textContent = 
    "Alarme cadastrado: " + currency + ", Valor Alvo: R$ " + targetValue.toFixed(2);
  
  document.getElementById("alarmForm").reset();
}

function gerarIdAlarme() {
  let alarmesExistentes = JSON.parse(localStorage.getItem("alarmes")) || [];
  return alarmesExistentes.length ? alarmesExistentes[alarmesExistentes.length - 1].id + 1 : 1;
}

populateAlarmCurrencySelect();
