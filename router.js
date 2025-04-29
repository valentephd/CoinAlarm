document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        '/': './index.html',
        '/cryptoPurchase': './components/cryptoPurchase.html',
        '/alarmView': './components/alarmView.html',
        '/cryptoRegister': './components/cryptoRegister.html',
        '/backup': './components/backup.html',
        '/cryptoSale': './components/cryptoSaleForm.html',
    };

    function navigateTo(path) {
        if (routes[path]) {
            window.location.href = routes[path];
        } else {
            console.error(`Rota não encontrada: ${path}`);
        }
    }

    document.querySelectorAll('a[data-route]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const path = event.target.getAttribute('href');
            navigateTo(path);
        });
    });
});
