# language: pt
Funcionalidade: Endereços
  Como cliente da EBAC-SHOP
  Quero cadastrar e editar meus endereços de faturamento e entrega
  Para agilizar minhas compras e receber os produtos no local correto

  Contexto:
    Dado que eu esteja autenticado na EBAC-SHOP
    E acesse a página "Endereços" em "Minha Conta"

  Cenário: Cadastrar endereço de faturamento com sucesso
    Quando eu preencher todos os campos obrigatórios do endereço de faturamento
    E clicar em "Salvar endereço"
    Então deve exibir a mensagem "Endereço alterado com sucesso"
    E o endereço deve ser exibido na página "Endereços"

  Esquema do Cenário: Impedir cadastro sem campo obrigatório
    Quando eu preencher o endereço de entrega deixando o campo <campo> vazio
    E clicar em "Salvar endereço"
    Então deve exibir a mensagem "<campo> é um campo obrigatório"

    Exemplos:
      | campo     |
      | Nome      |
      | Endereço  |
      | Cidade    |
      | CEP       |

  Esquema do Cenário: Validar o formato do CEP
    Quando eu preencher o endereço com o CEP <cep>
    E clicar em "Salvar endereço"
    Então o sistema deve <resultado>

    Exemplos:
      | cep        | resultado                                         |
      | 4810000    | exibir a mensagem "Por favor, informe um CEP válido" |
      | 48100000   | salvar o endereço com sucesso                     |
      | 481000000  | exibir a mensagem "Por favor, informe um CEP válido" |
      | 48100-000  | salvar o endereço com sucesso                     |

  Cenário: Editar um endereço existente
    Dado que eu possua um endereço de entrega cadastrado
    Quando eu alterar a cidade para "Salvador"
    E clicar em "Salvar endereço"
    Então deve exibir a mensagem "Endereço alterado com sucesso"
    E o endereço deve ser exibido com a cidade "Salvador"