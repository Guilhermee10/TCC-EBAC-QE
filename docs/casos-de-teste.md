# Casos de Teste — EBAC Shop

**Legenda de automação:**
✅ Automatizado no TCC · 🔜 Candidato à automação futura · ❌ Manual

**Critérios usados para decidir a automação:**
1. **Valor para a regressão:** fluxos críticos que precisam rodar sempre.
2. **Estabilidade:** resultado previsível, sem dependência de dados que não controlamos.
3. **Custo × benefício:** se preparar o cenário custa mais do que executá-lo manualmente, ele fica manual.
4. **Independência:** testes automatizados não podem alterar o estado compartilhado (ex.: bloquear ou trocar a senha dos usuários de teste).

---

## US-0001 — Adicionar item ao carrinho

**Premissas adotadas (pontos ambíguos da história):**
- As faixas de desconto consideram o **valor total do carrinho**.
- Até R$ 199,99: sem cupom · R$ 200,00 a R$ 600,00: 10% · R$ 600,01 a R$ 990,00: 15% · acima de R$ 990,00: bloqueado.
- O cupom é aplicado automaticamente.

| ID | Título | Fluxo | Técnica | Pré-condição | Passos | Resultado esperado | Prioridade | Automação |
|---|---|---|---|---|---|---|---|---|
| CT-001 | Adicionar produto ao carrinho com sucesso | Feliz | Caso de uso | Página de produto com estoque | 1. Selecionar tamanho "M" 2. Selecionar cor "Blue" 3. Quantidade 1 4. Clicar em "Comprar" | Produto exibido no carrinho; total igual ao preço unitário | Alta | ✅ UI |
| CT-002 | Adicionar a quantidade máxima (10 unidades) | Alternativo | Valor limite (limite válido) | Carrinho vazio | 1. Selecionar tamanho e cor 2. Quantidade 10 3. Clicar em "Comprar" | 10 unidades adicionadas | Alta | ✅ UI |
| CT-003 | Adicionar mais de 10 unidades | Negativo | Valor limite (limite inválido) | Carrinho vazio | 1. Selecionar tamanho e cor 2. Quantidade 11 3. Clicar em "Comprar" | Produto não adicionado; mensagem "Não é permitido adicionar mais de 10 unidades deste produto" | Alta | ✅ UI |
| CT-004 | Adicionar sem selecionar tamanho e cor | Alternativo | Partição de equivalência | Página de produto com variações | 1. Não selecionar opções 2. Clicar em "Comprar" | Produto não adicionado; alerta solicitando as opções | Média | ✅ UI |
| CT-005 | Cupom conforme a faixa de valor | Feliz/Alternativo | Partição de equivalência + valor limite | Produtos com preços controlados | 1. Montar carrinho com R$ 199,99 / 200,00 / 600,00 / 600,01 / 990,00 2. Verificar desconto | 0% / 10% / 10% / 15% / 15% | Alta | ❌ Manual (exige massa de dados controlada) |
| CT-006 | Impedir carrinho acima de R$ 990,00 | Negativo | Valor limite | Carrinho com R$ 950,00 | 1. Adicionar produto de R$ 50,00 | Produto não adicionado; mensagem de limite de R$ 990,00 | Alta | ❌ Manual (exige massa de dados controlada) |

---

## US-0002 — Login na plataforma

**Premissas adotadas:**
- As 3 tentativas são consecutivas; um login com sucesso zera o contador.
- Durante o bloqueio, nem a senha correta permite o acesso.
- Usuário inexistente e senha incorreta recebem a **mesma** mensagem (evita enumeração de usuários).

**Tabela de decisão:**

| Condições / Ações | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| Usuário existe? | S | S | N | S | S |
| Usuário ativo? | S | S | – | N | S |
| Senha correta? | S | N | – | S | S |
| Login bloqueado? | N | N | N | N | S |
| → Acessa Minha Conta | X | | | | |
| → "Usuário ou senha inválidos" | | X | X | | |
| → "Conta inativa" | | | | X | |
| → "Login bloqueado" | | | | | X |

| ID | Título | Fluxo | Técnica | Pré-condição | Passos | Resultado esperado | Prioridade | Automação |
|---|---|---|---|---|---|---|---|---|
| CT-007 | Login com sucesso | Feliz | Tabela de decisão (R1) | Usuário ativo `user1_ebac` | 1. Acessar "Minha Conta" 2. Informar usuário e senha válidos 3. Clicar em "Login" | Painel exibido com saudação e menu "Pedidos" | Alta | ✅ UI |
| CT-008 | Login com senha incorreta | Negativo | Tabela de decisão (R2) | Usuário ativo | 1. Informar `user1_ebac` e senha incorreta 2. Clicar em "Login" | Login negado; "Usuário ou senha inválidos" | Alta | ✅ UI |
| CT-009 | Login com usuário inexistente | Negativo | Tabela de decisão (R3) | — | 1. Informar `naoexiste_ebac` e qualquer senha 2. Clicar em "Login" | Login negado; mesma mensagem do CT-008 | Alta | ✅ UI |
| CT-010 | Login com campos vazios | Negativo | Partição de equivalência (vazio) | — | 1. Deixar campos em branco 2. Clicar em "Login" | Login negado; mensagem solicitando preenchimento | Média | ✅ UI |
| CT-011 | Login de usuário inativo | Negativo | Tabela de decisão (R4) | Usuário inativado pelo admin | 1. Informar credenciais corretas do inativo 2. Clicar em "Login" | Login negado; mensagem de conta inativa | Média | ❌ Manual (depende de massa no painel admin) |
| CT-012 | Bloqueio após 3 tentativas incorretas | Negativo | Transição de estado + valor limite (2 e 3) | Usuário ativo | 1. Errar a senha 2 vezes 2. Errar a 3ª vez 3. Tentar com a senha correta | Após 2 erros: liberado. Após 3: bloqueado por 15 min, inclusive com a senha correta | Alta | ❌ Manual (bloquearia o usuário compartilhado pelos demais testes e pelo K6) |
| CT-013 | Login liberado após 15 minutos | Alternativo | Transição de estado | Login bloqueado | 1. Aguardar 15 minutos 2. Logar com credenciais corretas | Login realizado | Média | ❌ Manual (espera de 15 min inviável na pipeline) |

---

## US-0003 — API de cupons

**Premissas adotadas:**
- `code`, `amount`, `discount_type` e `description` são obrigatórios, conforme a história.
- O código é único **sem diferenciar maiúsculas de minúsculas**.

**Pré-condição comum:** autenticação Basic do administrador (credenciais via variável de ambiente).
**Boas práticas na automação:** código de cupom dinâmico (`Cupom_<timestamp>`), cada teste cria seus próprios dados, validação de contrato com Joi.

| ID | Título | Requisição | Resultado esperado | Técnica | Fluxo | Automação |
|---|---|---|---|---|---|---|
| CT-014 | Listar todos os cupons | `GET /wp-json/wc/v3/coupons` | 200; lista de cupons válida no contrato | Caso de uso | Feliz | ✅ API |
| CT-015 | Buscar cupom por ID existente | `GET /coupons/{id}` (ID criado no próprio teste) | 200; cupom com o ID buscado, válido no contrato | Partição (ID válido) | Feliz | ✅ API |
| CT-016 | Buscar cupom por ID inexistente | `GET /coupons/999999999` | 404; mensagem de ID inválido | Partição (ID inválido) | Negativo | ✅ API |
| CT-017 | Cadastrar cupom com sucesso | `POST /coupons` com os 4 campos | 201; ID gerado; dados iguais aos enviados; contrato válido | Caso de uso | Feliz | ✅ API |
| CT-018 | Cadastrar cupom com código repetido | `POST` duas vezes com o mesmo `code` | 400; código já existente | Regra de negócio | Negativo | ✅ API |
| CT-019 | Código repetido com caixa diferente | `POST "Cupom_X"` e depois `"cupom_x"` | 400 | Partição (caixa) | Negativo | ✅ API |
| CT-020 | Cadastrar sem campo obrigatório | `POST` sem `code` / `amount` / `discount_type` / `description` | 400 em cada caso | Partição (campo ausente) | Negativo | ✅ API (data-driven) |
| CT-021 | `discount_type` inválido | `POST` com `"discount_type": "brinde"` | 400 | Partição (fora do domínio) | Negativo | ✅ API |
| CT-022 | Acesso sem autenticação | `GET /coupons` sem `Authorization` | 401 | Segurança | Negativo | ✅ API |

---

## US-0004 — Catálogo de produtos (Web + Mobile)

| ID | Título | Fluxo | Técnica | Resultado esperado | Automação |
|---|---|---|---|---|---|
| CT-023 | Exibir lista de produtos | Feliz | Caso de uso | Cada produto exibe nome, imagem e preço | ✅ UI + ✅ Mobile |
| CT-024 | Visualizar detalhes de um produto | Feliz | Caso de uso | Exibe nome, descrição, preço, tamanhos e cores | ✅ UI + ✅ Mobile |
| CT-025 | Buscar produto existente | Feliz | Partição (termo válido) | Exibe o produto buscado | ✅ UI |
| CT-026 | Buscar termo inexistente | Negativo | Partição (termo inválido) | "Nenhum produto foi encontrado" | ✅ UI |
| CT-027 | Busca sem diferenciar maiúsculas/minúsculas | Alternativo | Partição (caixa) | "hoodie" e "HOODIE" retornam os mesmos produtos | 🔜 |
| CT-028 | Ordenar por menor preço | Feliz | Caso de uso | Preços em ordem crescente | 🔜 |
| CT-029 | Produto fora de estoque | Negativo | Partição (sem estoque) | "Fora de estoque"; botão Comprar indisponível | ❌ Manual (depende do estoque) |

---

## US-0005 — Painel Minha Conta

| ID | Título | Fluxo | Técnica | Resultado esperado | Automação |
|---|---|---|---|---|---|
| CT-030 | Exibir painel para cliente autenticado | Feliz | Caso de uso | Saudação com o nome do cliente | ✅ UI |
| CT-031 | Exibir menu completo | Feliz | Caso de uso | Painel, Pedidos, Endereços, Detalhes da conta e Sair visíveis | 🔜 |
| CT-032 | Acessar Minha Conta sem login | Negativo | Partição (não autenticado) | Formulário de login exibido; painel oculto | ✅ UI |
| CT-033 | Logout encerra a sessão | Alternativo | Transição de estado | Ao voltar em "Minha Conta", formulário de login é exibido | 🔜 |

---

## US-0006 — Meus pedidos

| ID | Título | Fluxo | Técnica | Resultado esperado | Automação |
|---|---|---|---|---|---|
| CT-034 | Listar pedidos do cliente | Feliz | Caso de uso | Pedidos do mais recente ao mais antigo, com número, data, status e total | ❌ Manual (depende de pedidos existentes) |
| CT-035 | Visualizar detalhe de um pedido | Feliz | Caso de uso | Produtos, quantidades, valores e endereços | ❌ Manual (idem) |
| CT-036 | Cliente sem pedidos | Alternativo | Partição (lista vazia) | "Nenhum pedido foi feito ainda" + botão de navegar | ✅ UI (usuário novo criado no teste) |
| CT-037 | Acessar pedido de outro cliente pela URL | Negativo | Segurança (IDOR — OWASP Broken Access Control) | Detalhes não exibidos; pedido inválido | ❌ Manual (exploratório de segurança) |

---

## US-0007 — Endereços

| ID | Título | Fluxo | Técnica | Resultado esperado | Automação |
|---|---|---|---|---|---|
| CT-038 | Cadastrar endereço de faturamento | Feliz | Caso de uso | "Endereço alterado com sucesso"; endereço exibido | ✅ UI |
| CT-039 | Campo obrigatório vazio (Nome, Endereço, Cidade, CEP) | Negativo | Partição (campo vazio) | "[Campo] é um campo obrigatório" | ✅ UI (data-driven) |
| CT-040 | CEP com 7, 8 e 9 dígitos e com hífen | Negativo/Feliz | Valor limite + partição | 7 e 9 rejeitados; 8 e com hífen aceitos | 🔜 |
| CT-041 | Editar endereço existente | Alternativo | Caso de uso | Endereço exibido com a cidade alterada | 🔜 |

---

## US-0008 — Detalhes da conta

| ID | Título | Fluxo | Técnica | Resultado esperado | Automação |
|---|---|---|---|---|---|
| CT-042 | Atualizar nome de exibição | Feliz | Caso de uso | Mensagem de sucesso; saudação com o novo nome (restaurado ao final) | ✅ UI |
| CT-043 | E-mail em formato inválido | Negativo | Partição (sem @, sem domínio, vazio) | Mensagem de e-mail inválido/obrigatório | ✅ UI |
| CT-044 | Senhas diferentes / senha atual incorreta | Negativo | Tabela de decisão | "As novas senhas não coincidem" / "Sua senha atual está incorreta" | 🔜 |
| CT-045 | Alterar senha e logar com a nova | Feliz | Validação de efeito | Login com a nova senha funciona | ❌ Manual (alteraria a senha do usuário compartilhado) |

---

## Resumo

| US | Total | ✅ Automatizado | 🔜 Candidato | ❌ Manual |
|---|---|---|---|---|
| US-0001 Carrinho | 6 | 4 | 0 | 2 |
| US-0002 Login | 7 | 4 | 0 | 3 |
| US-0003 API de cupons | 9 | 9 | 0 | 0 |
| US-0004 Catálogo | 7 | 4 (UI) + 2 (Mobile) | 2 | 1 |
| US-0005 Minha Conta | 4 | 2 | 2 | 0 |
| US-0006 Meus pedidos | 4 | 1 | 0 | 3 |
| US-0007 Endereços | 4 | 2 | 2 | 0 |
| US-0008 Detalhes da conta | 4 | 2 | 1 | 1 |
| **Total** | **45** | **30** | **7** | **8** |
