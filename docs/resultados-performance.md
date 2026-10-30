# Resultados dos testes de performance (K6)

**Data da execução:** 25/10/2026
**Ambiente:** http://lojaebac.ebaconline.art.br (servidor de testes compartilhado)
**Origem da carga:** máquina local do autor (conexão residencial)

## Configuração da carga

| Parâmetro | Valor |
|---|---|
| Usuários virtuais (VUs) | 20 |
| Tempo de execução | 2 minutos (total) |
| Ramp-up | 20 segundos (0 → 20 VUs) |
| Carga estável | 1min40s com 20 VUs |
| Think time | 1 segundo entre ações |
| Massa de dados | `user1_ebac` a `user5_ebac` |

**Premissas adotadas:**
- Os 2 minutos foram interpretados como tempo **total**, incluindo o ramp-up.
- O enunciado não define limites de desempenho. Foram adotados como critérios de aceitação:
  taxa de erro < 1%, p(95) do tempo de resposta < 3s e checks > 99%.

## Resultados

| Métrica | PERF-01 Login | PERF-02 Catálogo | Critério |
|---|---|---|---|
| Requisições totais | 591 | 574 | — |
| Vazão (req/s) | 4,71 | 4,50 | — |
| Iterações completas | 246 | 193 | — |
| Tempo de resposta mínimo | 200,71 ms | 187,62 ms | — |
| Tempo de resposta mediano | 3,63 s | 3,35 s | — |
| Tempo de resposta médio | 3,40 s | 3,32 s | — |
| **p(95) do tempo de resposta** | **4,96 s** ❌ | **4,93 s** ❌ | < 3 s |
| Tempo de resposta máximo | 5,60 s | 6,76 s | — |
| **Requisições com falha** | **17,08%** (101) ❌ | **5,05%** (29) ❌ | < 1% |
| **Checks aprovados** | **78,45%** ❌ | **92,35%** ❌ | > 99% |

Evidências: `relatorios/k6-login.png` e `relatorios/k6-catalogo.png`.

## Análise

### O que os resultados comprovam

Nas condições desta execução, os dois fluxos violaram os três critérios adotados (p(95) do tempo
de resposta, taxa de falhas e checks), e o login teve taxa de falhas maior que a do catálogo
(17,08% contra 5,05%).

### Hipóteses a investigar

O resumo agregado do K6 mostra estatísticas da execução inteira, mas não informa **quando** cada
requisição ocorreu nem o estado do servidor. As explicações abaixo são hipóteses, não conclusões:

1. **Degradação com o aumento da concorrência.** A diferença entre o mínimo (~190–200 ms) e a
   mediana (~3,4–3,6 s) sugere que os menores tempos ocorreram com poucos usuários, possivelmente
   no início do ramp-up. **Como confirmar:** analisar a série temporal do painel do K6 (relatório
   HTML), relacionando tempo de resposta e número de VUs ao longo do teste.
2. **Possível saturação do servidor.** A vazão de ~4,5–4,7 req/s com 20 VUs é compatível com
   saturação, mas também com latência de rede, limitação de requisições (rate limiting) ou carga
   de outros usuários do ambiente compartilhado. **Como confirmar:** métricas do servidor (CPU,
   memória, processos PHP, banco de dados) e execuções com cargas crescentes (5, 10 e 20 VUs) para
   verificar se a vazão para de crescer.
3. **Causa da maior taxa de falhas no login.** Uma hipótese é o custo maior da operação
   (verificação de senha, consulta ao banco e criação de sessão) em relação ao catálogo, que faz
   basicamente leituras. **Como confirmar:** registrar a distribuição dos códigos de status das
   falhas (5xx, 429 ou tempo esgotado).

## Limitações do teste

- O servidor é **compartilhado** por outros alunos da EBAC, que podem estar gerando carga ao mesmo
  tempo, o que afeta os resultados.
- A carga foi gerada a partir de uma **conexão residencial**: os tempos incluem a latência da rede
  do autor até o servidor.
- Os resultados representam uma única execução. Para conclusões mais robustas, o ideal é repetir o
  teste e comparar as execuções, preferencialmente em um ambiente dedicado (ex.: a loja em Docker).

## Conclusão

Nas condições desta execução, a EBAC Shop **não atendeu** aos critérios de desempenho adotados nos
dois fluxos avaliados. Identificar a causa exige investigar as hipóteses acima, preferencialmente
em um ambiente dedicado (ex.: a loja executada em Docker), onde a carga de terceiros não interfere
e as métricas do servidor podem ser coletadas.
