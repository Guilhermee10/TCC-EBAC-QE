# language: pt
Funcionalidade: Detalhes da conta
  Como cliente da EBAC-SHOP
  Quero editar meus dados pessoais e alterar minha senha
  Para manter minhas informações atualizadas e minha conta segura

  Contexto:
    Dado que eu esteja autenticado na EBAC-SHOP
    E acesse a página "Detalhes da conta" em "Minha Conta"

  Cenário: Atualizar dados pessoais com sucesso
    Quando eu alterar o nome de exibição para "Guilherme QA"
    E clicar em "Salvar alterações"
    Então deve exibir a mensagem "Detalhes da conta modificados com sucesso"
    E o painel deve exibir a saudação com o nome "Guilherme QA"

  Esquema do Cenário: Validar o campo e-mail
    Quando eu alterar o e-mail para <email>
    E clicar em "Salvar alterações"
    Então o sistema deve <resultado>

    Exemplos:
      | email                 | resultado                                                  |
      | "guilherme@email.com" | salvar as alterações com sucesso                           |
      | "guilhermeemail.com"  | exibir a mensagem "Por favor, forneça um e-mail válido"    |
      | "guilherme@"          | exibir a mensagem "Por favor, forneça um e-mail válido"    |
      | ""                    | exibir a mensagem "E-mail é um campo obrigatório"          |

  Esquema do Cenário: Alterar a senha
    Quando eu informar a senha atual <atual>, a nova senha <nova> e a confirmação <confirmacao>
    E clicar em "Salvar alterações"
    Então o sistema deve <resultado>

    Exemplos:
      | atual       | nova         | confirmacao  | resultado                                                 |
      | "correta"   | "Nova@1234"  | "Nova@1234"  | alterar a senha com sucesso                               |
      | "correta"   | "Nova@1234"  | "Outra@123"  | exibir a mensagem "As novas senhas não coincidem"         |
      | "incorreta" | "Nova@1234"  | "Nova@1234"  | exibir a mensagem "Sua senha atual está incorreta"        |
      | ""          | "Nova@1234"  | "Nova@1234"  | exibir a mensagem "Informe sua senha atual"               |

  Cenário: Acessar com a nova senha após a alteração
    Dado que eu tenha alterado minha senha para "Nova@1234"
    Quando eu sair da conta e fizer login com a senha "Nova@1234"
    Então devo ser direcionado para a página "Minha Conta"