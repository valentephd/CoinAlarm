const routes = {
  index: 'components/index/index.html',
  dashboard: 'components/dashboard/dashboard.html',
  cryptoPurchase: 'components/cryptoPurchase/cryptoPurchase.html',
  cryptoSale: 'components/cryptoSale/cryptoSale.html',
  alarmView: 'components/alarmView/alarmView.html',
  backup: 'components/backup/backup.html',
};

function loadComponent(hash) {
  const path = routes[hash] || routes.index;
  fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('content').innerHTML = html;
    })
    .catch(error => {
      console.error(error);
      document.getElementById('content').innerHTML = '<p>Erro ao carregar o componente.</p>';
    });
}

window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  loadComponent(hash);
});

// Load the default route on page load
loadComponent(location.hash.slice(1) || 'index');
