# language: pt
Funcionalidade: Adicionar item ao carrinho
  Como cliente da EBAC-SHOP
  Quero adicionar produtos no carrinho
  Para realizar a compra dos itens

  Contexto:
    Dado que eu acesse a página de um produto da EBAC-SHOP

  Cenário: Adicionar produto ao carrinho com sucesso
    Quando eu selecionar o tamanho, a cor e a quantidade 1
    E clicar no botão "Comprar"
    Então o produto deve ser exibido no carrinho
    E o valor total deve corresponder ao preço do produto

  Esquema do Cenário: Limite de unidades do mesmo produto
    Quando eu adicionar <quantidade> unidades do mesmo produto ao carrinho
    Então o sistema deve <resultado>

    Exemplos:
      | quantidade | resultado                                                                         |
      | 9          | adicionar o produto ao carrinho                                                   |
      | 10         | adicionar o produto ao carrinho                                                   |
      | 11         | exibir a mensagem "Não é permitido adicionar mais de 10 unidades deste produto"   |

  Esquema do Cenário: Cupom de desconto conforme o valor do carrinho
    Dado que o valor total do meu carrinho seja <valor>
    Quando eu acessar o carrinho
    Então deve ser aplicado o desconto de <desconto>

    Exemplos:
      | valor       | desconto |
      | R$ 199,99   | 0%       |
      | R$ 200,00   | 10%      |
      | R$ 600,00   | 10%      |
      | R$ 600,01   | 15%      |
      | R$ 990,00   | 15%      |

  Cenário: Impedir carrinho com valor acima de R$ 990,00
    Dado que o valor total do meu carrinho seja R$ 950,00
    Quando eu adicionar um produto de R$ 50,00
    Então o produto não deve ser adicionado ao carrinho
    E deve exibir a mensagem "O valor total do carrinho não pode ultrapassar R$ 990,00"

  Cenário: Tentar adicionar produto sem selecionar as opções obrigatórias
    Quando eu clicar no botão "Comprar" sem selecionar tamanho e cor
    Então o produto não deve ser adicionado ao carrinho
    E deve exibir um alerta solicitando a seleção das opções