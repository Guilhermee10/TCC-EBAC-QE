# language: pt
Funcionalidade: Meus pedidos
  Como cliente da EBAC-SHOP
  Quero visualizar o histórico dos meus pedidos
  Para acompanhar o status e conferir os detalhes das minhas compras

  Contexto:
    Dado que eu esteja autenticado na EBAC-SHOP

  Cenário: Listar os pedidos do cliente
    Dado que eu possua pedidos realizados
    Quando eu acessar a página "Pedidos" em "Minha Conta"
    Então devo visualizar meus pedidos do mais recente para o mais antigo
    E cada pedido deve exibir número, data, status, total e a opção "Visualizar"

  Cenário: Visualizar os detalhes de um pedido
    Dado que eu possua pedidos realizados
    Quando eu clicar em "Visualizar" em um pedido
    Então devo visualizar os produtos, quantidades e valores do pedido
    E devo visualizar os endereços de faturamento e entrega

  Cenário: Cliente sem pedidos realizados
    Dado que eu não possua pedidos realizados
    Quando eu acessar a página "Pedidos" em "Minha Conta"
    Então deve exibir a mensagem "Nenhum pedido foi feito ainda"
    E deve exibir o botão "Navegar pelos produtos"

  Cenário: Impedir acesso ao pedido de outro cliente
    Dado que exista um pedido realizado por outro cliente
    Quando eu acessar diretamente a URL desse pedido
    Então os detalhes do pedido não devem ser exibidos
    E deve exibir uma mensagem de pedido inválido