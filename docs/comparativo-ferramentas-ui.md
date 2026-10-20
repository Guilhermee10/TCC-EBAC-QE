# Comparativo de ferramentas para automação de UI

Para escolher a ferramenta de automação web, foram comparadas quatro opções que o autor
utilizou na prática durante o curso (repositório
[Ebac-tests](https://github.com/Guilhermee10/Ebac-tests) e exercícios dos módulos de UI),
sempre contra a mesma aplicação: a EBAC Shop.

## Critérios de avaliação

Os critérios foram definidos a partir do contexto deste projeto:

1. **Linguagem única no projeto:** a automação de API é obrigatoriamente feita com
   Supertest (JavaScript), a automação mobile utiliza WebdriverIO (JavaScript) e os scripts
   de performance do K6 também são escritos em JavaScript. Uma ferramenta de UI na mesma
   linguagem reduz a curva de manutenção e permite reaproveitar conhecimento e utilitários.
2. **Espera automática:** principal causa de testes instáveis (*flaky*) em UI.
3. **Debug e diagnóstico de falhas.**
4. **Esforço de configuração inicial.**
5. **Limitações relevantes para um e-commerce.**

## Quadro comparativo

| Critério | **Cypress** (JavaScript) | **Playwright** (Python / C#) | **Selenium WebDriver** (Java + TestNG) | **WebdriverIO** (JavaScript) |
|---|---|---|---|---|
| Linguagem | JavaScript/TypeScript | Python, C#, Java, JS/TS | Java, Python, C#, JS, Ruby | JavaScript/TypeScript |
| Mesma linguagem do resto do projeto | ✅ Sim | ⚠️ Apenas na versão JS | ❌ Não (na versão usada) | ✅ Sim |
| Espera automática | ✅ Nativa em comandos e asserções | ✅ Nativa (*auto-wait*) | ❌ Esperas explícitas manuais | ⚠️ Parcial (*waitFor*) |
| Debug | ✅ *Time travel* com snapshot de cada passo, vídeos e screenshots | ✅ *Trace Viewer* | ⚠️ Logs e screenshots manuais | ⚠️ Logs e screenshots |
| Configuração inicial | ✅ Um pacote npm, sem drivers | ✅ Simples (baixa navegadores) | ❌ Mais trabalhosa (projeto Java, dependências, driver) | ⚠️ Assistente de configuração com várias opções |
| Execução | Dentro do navegador | Protocolo próprio (CDP e similares) | Protocolo WebDriver | WebDriver / DevTools |
| Navegadores | Chrome, Edge, Firefox, Electron | Chromium, Firefox, WebKit | Todos os principais | Todos os principais |
| Múltiplas abas e domínios | ⚠️ Limitado | ✅ Completo | ✅ Completo | ✅ Completo |
| Mobile nativo | ❌ Não | ❌ Não | ⚠️ Via Appium | ✅ Via Appium |
| Comunidade e material em português | ✅ Muito ampla | ✅ Crescendo rápido | ✅ A mais antiga | ⚠️ Menor |

## Decisão: Cypress

O **Cypress** foi escolhido para a automação de UI pelos seguintes motivos:

- **Linguagem única (JavaScript)** para UI, API (Supertest), Mobile (WebdriverIO) e
  performance (K6), o que simplifica a manutenção do repositório e da pipeline de CI.
- **Espera automática nativa**, reduzindo testes instáveis sem a necessidade de esperas
  explícitas.
- **Debug visual** (*time travel*, screenshots e vídeos automáticos), que acelera a análise de
  falhas.
- **Configuração mínima**: um único pacote npm, sem gerenciamento de drivers.
- **Experiência prévia do autor**, adquirida no curso e em projeto pessoal.

As limitações do Cypress (suporte restrito a múltiplas abas e domínios e ausência de testes
mobile nativos) **não afetam o escopo deste trabalho**: os fluxos da EBAC Shop acontecem em uma
única aba e um único domínio, e a automação mobile é feita com Appium + WebdriverIO.

O **Playwright** seria a segunda opção. Ele tem recursos equivalentes e vantagens em
cenários multiaba e no WebKit (Safari), mas o autor o utilizou em Python e C#, o que quebraria
o critério de linguagem única. O **Selenium WebDriver** continua sendo a ferramenta mais
difundida no mercado, mas exige mais código de infraestrutura (esperas explícitas,
configuração do projeto), o que o torna menos produtivo neste contexto. O **WebdriverIO**
atende ao critério de linguagem e é usado neste projeto para mobile, mas para web o Cypress
oferece melhor experiência de debug.
