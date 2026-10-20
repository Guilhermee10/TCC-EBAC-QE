# language: pt
Funcionalidade: Login na plataforma
  Como cliente da EBAC-SHOP
  Quero fazer o login (autenticação) na plataforma
  Para visualizar meus pedidos

  Contexto:
    Dado que eu acesse a página de login da EBAC-SHOP

  Cenário: Login com sucesso de usuário ativo
    Dado que eu possua um cadastro ativo
    Quando eu inserir usuário e senha válidos
    E clicar no botão "Login"
    Então devo ser direcionado para a página "Minha Conta"
    E devo visualizar a opção "Pedidos"

  Esquema do Cenário: Login não autorizado
    Quando eu inserir o usuário <usuario> e a senha <senha>
    E clicar no botão "Login"
    Então o login não deve ser realizado
    E deve exibir a mensagem <mensagem>

    Exemplos:
      | usuario               | senha             | mensagem                                                     |
      | "cliente ativo"       | "senha incorreta" | "Usuário ou senha inválidos"                                 |
      | "usuário inexistente" | "qualquer senha"  | "Usuário ou senha inválidos"                                 |
      | "cliente inativo"     | "senha correta"   | "Sua conta está inativa. Entre em contato com o suporte"     |
      | ""                    | ""                | "Preencha usuário e senha"                                   |

  Esquema do Cenário: Bloqueio após tentativas de senha incorretas
    Dado que eu possua um cadastro ativo
    Quando eu errar a senha <tentativas> vezes seguidas
    Então o login deve <resultado>

    Exemplos:
      | tentativas | resultado                                                                    |
      | 2          | permitir uma nova tentativa                                                  |
      | 3          | ser bloqueado por 15 minutos com a mensagem "Login bloqueado. Tente novamente em 15 minutos" |

  Cenário: Tentar login com senha correta durante o bloqueio
    Dado que meu login tenha sido bloqueado por 3 tentativas incorretas
    Quando eu inserir usuário e senha válidos antes de 15 minutos
    Então o login não deve ser realizado
    E deve exibir a mensagem "Login bloqueado. Tente novamente em 15 minutos"

  Cenário: Login liberado após o fim do bloqueio
    Dado que meu login tenha sido bloqueado há 15 minutos
    Quando eu inserir usuário e senha válidos
    Então devo ser direcionado para a página "Minha Conta"