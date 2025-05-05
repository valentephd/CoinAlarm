document.getElementById('footer').innerHTML = `
  ${fetch('components/footer/footer.html').then(res => res.text())}
`;
