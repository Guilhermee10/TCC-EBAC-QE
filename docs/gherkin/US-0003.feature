# language: pt
Funcionalidade: API de cupons
  Como admin da EBAC-SHOP
  Quero criar um serviço de cupom
  Para poder listar e cadastrar os cupons

  Contexto:
    Dado que eu esteja autenticado como administrador via Basic Auth
    E que o serviço "/wp-json/wc/v3/coupons" esteja disponível

  Cenário: Listar todos os cupons cadastrados
    Quando eu enviar uma requisição GET para "/coupons"
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista de cupons
    E cada cupom deve respeitar o contrato de cupom

  Esquema do Cenário: Buscar cupom por ID
    Quando eu enviar uma requisição GET para "/coupons/<id>"
    Então o status da resposta deve ser <status>
    E a resposta deve <resultado>

    Exemplos:
      | id                 | status | resultado                                    |
      | de cupom existente | 200    | conter o cupom com o ID informado            |
      | 999999999          | 404    | conter a mensagem de "ID inválido"           |

  Cenário: Cadastrar cupom com todos os campos obrigatórios
    Quando eu enviar uma requisição POST para "/coupons" com:
      | code          | Ganhe10         |
      | amount        | 10.00           |
      | discount_type | fixed_product   |
      | description   | Cupom de teste  |
    Então o status da resposta deve ser 201
    E a resposta deve conter o ID do cupom criado
    E os dados retornados devem ser iguais aos enviados
    E a resposta deve respeitar o contrato de cupom

  Esquema do Cenário: Impedir cadastro de cupom com código repetido
    Dado que já exista um cupom com o código "Ganhe10"
    Quando eu enviar uma requisição POST para "/coupons" com o código <codigo>
    Então o status da resposta deve ser 400
    E deve exibir a mensagem informando que o código já existe

    Exemplos:
      | codigo    |
      | "Ganhe10" |
      | "ganhe10" |

  Esquema do Cenário: Impedir cadastro sem campo obrigatório
    Quando eu enviar uma requisição POST para "/coupons" sem o campo <campo>
    Então o status da resposta deve ser 400
    E deve exibir a mensagem informando que <campo> é obrigatório

    Exemplos:
      | campo           |
      | "code"          |
      | "amount"        |
      | "discount_type" |
      | "description"   |

  Cenário: Acessar a API sem autenticação
    Dado que eu envie a requisição sem o header "Authorization"
    Quando eu enviar uma requisição GET para "/coupons"
    Então o status da resposta deve ser 401