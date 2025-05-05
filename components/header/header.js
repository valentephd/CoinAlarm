document.getElementById('header').innerHTML = `
  ${fetch('components/header/header.html').then(res => res.text())}
`;
