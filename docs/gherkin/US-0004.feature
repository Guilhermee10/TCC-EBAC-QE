# language: pt
Funcionalidade: Catálogo de produtos
  Como cliente da EBAC-SHOP
  Quero navegar, buscar e filtrar os produtos da loja
  Para encontrar com facilidade o que desejo comprar

  Contexto:
    Dado que eu acesse a página de produtos da EBAC-SHOP

  Cenário: Exibir a lista de produtos com as informações principais
    Então devo visualizar a lista de produtos
    E cada produto deve exibir nome, imagem e preço

  Esquema do Cenário: Buscar produto pelo nome
    Quando eu buscar pelo termo <termo>
    Então devo visualizar <resultado>

    Exemplos:
      | termo                | resultado                                         |
      | "Abominable Hoodie"  | o produto "Abominable Hoodie"                     |
      | "hoodie"             | todos os produtos que contêm "hoodie" no nome     |
      | "produtoinexistente" | a mensagem "Nenhum produto foi encontrado"        |

  Cenário: Ordenar produtos pelo menor preço
    Quando eu ordenar os produtos por "Preço: menor para maior"
    Então os produtos devem ser exibidos em ordem crescente de preço

  Cenário: Visualizar os detalhes de um produto
    Quando eu clicar em um produto da lista
    Então devo visualizar nome, descrição e preço do produto
    E devo visualizar as opções de tamanho e cor

  Cenário: Impedir compra de produto fora de estoque
    Quando eu acessar um produto sem estoque
    Então deve exibir a informação "Fora de estoque"
    E o botão "Comprar" não deve estar disponível