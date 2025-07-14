# Sistema de Controle de Criptomoedas

Site Github Pages: https://valentephd.github.io/CoinAlarm/

## Propósito do Sistema
O Sistema de Controle de Criptomoedas é projetado para ajudar usuários a gerenciar suas criptomoedas. Ele permite o acompanhamento de investimentos, configuração de alarmes para preços específicos e visualização de dados em tempo real, tudo em uma interface intuitiva.

## Funcionalidades
- **Cadastro de Compras**: Registre compras de criptomoedas com detalhes como quantidade, valor total e data.
- **Alarmes de Preço**: Configure alarmes para ser notificado quando uma criptomoeda atingir um valor específico.
- **Tabela de Visão Geral**: Visualize todas as criptomoedas cadastradas, incluindo quantidade total, valor investido, preço médio, valor atual e ganhos/perdas.
- **Backup de Dados**: Faça o download dos dados armazenados no LocalStorage em arquivos JSON para backup ou análise externa.
- **Atualização de Preços**: Atualize os preços das criptomoedas em tempo real usando a API do Mercado Bitcoin.

## Visualizações
- **Dashboard**: Uma visão geral das criptomoedas cadastradas, com tabelas dinâmicas e resumos financeiros.
- **Cadastro de Compra**: Formulário para adicionar novas compras de criptomoedas.
- **Visualização de Alarmes**: Tela para gerenciar alarmes de preço configurados.
- **Backup**: Página dedicada para visualizar e baixar os dados do LocalStorage.

## Novidades
- Adicionado um botão de backup no menu principal que permite acessar a página de backup.
- A página de backup agora possui:
  - Um botão de voltar para retornar ao dashboard.
  - Janelas separadas para cada tipo de dado armazenado no LocalStorage (e.g., `availableCurrencies`, `alarmes`).
  - Botões para salvar cada tipo de dado individualmente.
  - Um botão para salvar todos os dados de uma vez.
