# TCC-EBAC-QE

Trabalho de Conclusão de Curso — **Engenheiro de Qualidade de Software (EBAC)**
Autor: **Guilherme de Almeida Santos**

Estratégia de testes completa para o e-commerce **EBAC Shop**
(<http://lojaebac.ebaconline.art.br/>), seguindo o fluxo de trabalho de um
Quality Engineer: do planejamento à entrega.

## Estrutura do repositório

| Pasta | Conteúdo | Ferramentas |
|---|---|---|
| `docs/` | Mapa mental da estratégia, critérios de aceitação (Gherkin) e casos de teste | — |
| `UI/` | Testes automatizados da interface web | Cypress + Page Objects |
| `API/` | Testes automatizados da API de cupons, com validação de contrato | Supertest + Jest + Joi |
| `Mobile/` | Testes automatizados do app (Catálogo de Produtos) | Appium + WebdriverIO |

## Histórias de usuário

| ID | História | Origem |
|---|---|---|
| US-0001 | Adicionar item ao carrinho | EBAC |
| US-0002 | Login na plataforma | EBAC |
| US-0003 | API de cupons | EBAC |
| US-0004 | Catálogo de produtos | Criada no TCC |
| US-0005 | Painel Minha Conta | Criada no TCC |
| US-0006 | Meus pedidos | Criada no TCC |
| US-0007 | Endereços | Criada no TCC |
| US-0008 | Detalhes da conta | Criada no TCC |

Os critérios de aceitação estão em [`docs/gherkin`](docs/gherkin) e os casos de
teste em [`docs/casos-de-teste.md`](docs/casos-de-teste.md).

## Status

- [x] Estratégia de teste (mapa mental)
- [x] Critérios de aceitação em Gherkin
- [x] Casos de teste
- [x] Automação de UI
- [x] Automação de API
- [x] Automação Mobile
- [x] Integração contínua (GitHub Actions)
- [x] Testes de performance (K6)
