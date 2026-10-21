# BUG-001 — Mensagem de login revela se o usuário está cadastrado

| Campo | Valor |
|---|---|
| **ID** | BUG-001 |
| **História relacionada** | US-0002 — Login na plataforma |
| **Caso de teste** | CT-009 — Não deve revelar se o usuário existe |
| **Tipo** | Segurança (enumeração de contas) |
| **Severidade** | Média |
| **Prioridade** | Média |
| **Ambiente** | http://lojaebac.ebaconline.art.br — Chrome — Windows |
| **Detectado por** | Automação de UI (Cypress) |
| **Status** | Aberto |

## Descrição

Ao tentar fazer login com um usuário que não existe, a loja exibe uma mensagem informando
que o usuário **não está registrado**. Já para um usuário existente com senha incorreta, a
mensagem é diferente. Comparando as duas respostas, qualquer pessoa consegue descobrir quais
usuários estão cadastrados na plataforma.

## Pré-condições

- Estar deslogado na EBAC Shop.

## Passos para reproduzir

1. Acessar http://lojaebac.ebaconline.art.br/minha-conta/
2. No campo "Nome de usuário ou e-mail", informar `usuario_inexistente_ebac`
3. No campo "Senha", informar `qualquerSenha123`
4. Clicar em "Login"

## Resultado esperado

Uma mensagem **genérica**, igual para usuário inexistente e para senha incorreta, por exemplo:
*"Usuário ou senha inválidos."*

## Resultado obtido

> Erro: O usuário usuario_inexistente_ebac não está registrado neste site. Se você não está
> certo de seu nome de usuário, experimente o endereço de e-mail.

## Impacto

Um atacante pode montar uma lista de usuários válidos testando nomes ou e-mails e depois
concentrar ataques de força bruta ou de *credential stuffing* apenas nessas contas. A regra de
bloqueio após 3 tentativas (US-0002) reduz o risco, mas não elimina a exposição de
informação.

## Referências

- OWASP Web Security Testing Guide — *Testing for Account Enumeration and Guessable User
  Account* (WSTG-IDNT-04)
- OWASP Top 10 — A07: Identification and Authentication Failures

## Sugestão de correção

Padronizar a mensagem de erro de autenticação para todos os cenários de falha (usuário
inexistente e senha incorreta). No WordPress/WooCommerce isso pode ser feito pelo filtro
`login_errors`.

## Evidência

![Evidência do BUG-001](evidencias/BUG-001.png)
