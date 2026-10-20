# language: pt
Funcionalidade: Painel Minha Conta
  Como cliente da EBAC-SHOP
  Quero acessar um painel com as informações da minha conta
  Para gerenciar meus pedidos, endereços e dados pessoais em um só lugar

  Cenário: Exibir o painel para o cliente autenticado
    Dado que eu esteja autenticado na EBAC-SHOP
    Quando eu acessar a página "Minha Conta"
    Então devo visualizar uma saudação com o meu nome

  Cenário: Exibir o menu completo do painel
    Dado que eu esteja autenticado na EBAC-SHOP
    Quando eu acessar a página "Minha Conta"
    Então devo visualizar as opções "Painel", "Pedidos", "Endereços", "Detalhes da conta" e "Sair"

  Cenário: Redirecionar para o login quando não autenticado
    Dado que eu não esteja autenticado
    Quando eu acessar a página "Minha Conta"
    Então devo visualizar o formulário de login
    E não devo visualizar as informações do painel

  Cenário: Encerrar a sessão
    Dado que eu esteja autenticado na EBAC-SHOP
    Quando eu clicar em "Sair"
    Então minha sessão deve ser encerrada
    E ao acessar "Minha Conta" devo visualizar o formulário de login