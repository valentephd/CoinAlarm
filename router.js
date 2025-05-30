import { renderDashboard } from "./components/dashboard/dashboard.js";
import { populateCurrencySelect } from "./components/cryptoPurchase/cryptoPurchase.js";
import { populateSaleCurrencySelect } from "./components/cryptoSaleForm/cryptoSaleForm.js";

const routes = {
    dashboard: "components/dashboard/dashboard.html",
    cryptoPurchase: "components/cryptoPurchase/cryptoPurchase.html",
    cryptoSale: "components/cryptoSaleForm/cryptoSaleForm.html",
    alarmView: "components/alarmView/alarmView.html",
    backup: "components/backup/backup.html",
};

function loadComponent(hash) {
    const path = routes[hash] || routes.dashboard;
    fetch(path)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${path}`);
            }
            return response.text();
        })
        .then((html) => {
            const content = document.getElementById("content");
            content.style.display = "block";
            content.innerHTML = html;
            if (hash === "dashboard") {
                renderDashboard();
            } else if (hash === "cryptoPurchase") {
                populateCurrencySelect();
            } else if (hash === "cryptoSale") {
                populateSaleCurrencySelect();
            }
        })
        .catch((error) => {
            console.error(error);
            document.getElementById("content").innerHTML =
                "<p>Erro ao carregar o componente.</p>";
        });
}

window.addEventListener("hashchange", () => {
    const hash = location.hash.slice(1);
    loadComponent(hash);
});

// Carregar a rota padrão na inicialização
loadComponent(location.hash.slice(1) || "dashboard");
