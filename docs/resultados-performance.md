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

1. **Degradação sob carga.** O menor tempo de resposta (~190–200 ms) representa o servidor
   praticamente sem concorrência, no início do ramp-up. Com 20 VUs simultâneos, a mediana
   passou para ~3,4–3,6 s, cerca de **17 a 18 vezes mais lenta**. O sistema não escala bem para
   essa quantidade de usuários.
2. **Saturação.** Com 20 VUs, a vazão ficou em apenas ~4,5–4,7 requisições por segundo. Como os
   VUs passam a maior parte do tempo esperando respostas, o gargalo está no servidor, e não no
   gerador de carga.
3. **O login é o fluxo mais crítico.** A taxa de erro do login (17,08%) foi mais de 3 vezes maior
   que a do catálogo (5,05%). Isso é coerente com o custo de cada operação: o login verifica a
   senha (operação propositalmente cara), consulta o banco e cria sessão, enquanto o catálogo é
   majoritariamente leitura. Inclusive a própria abertura da página de login falhou em 18% das
   vezes.
4. **Falhas sob carga.** As falhas indicam que o servidor passou a recusar ou não completar parte
   das requisições. Como próximo passo de investigação, recomenda-se registrar a distribuição dos
   códigos de status HTTP das falhas (ex.: 5xx, 429 ou timeouts) para identificar a causa.

## Limitações do teste

- O servidor é **compartilhado** por outros alunos da EBAC, que podem estar gerando carga ao mesmo
  tempo, o que afeta os resultados.
- A carga foi gerada a partir de uma **conexão residencial**: os tempos incluem a latência da rede
  do autor até o servidor.
- Os resultados representam uma única execução. Para conclusões mais robustas, o ideal é repetir o
  teste e comparar as execuções, preferencialmente em um ambiente dedicado (ex.: a loja em Docker).

## Conclusão

Com 20 usuários simultâneos, a EBAC Shop **não atende** aos critérios de desempenho adotados nos dois
fluxos avaliados, sendo o **login** o ponto mais crítico. Recomenda-se investigar a capacidade do
servidor e avaliar otimizações como cache de páginas para o catálogo e ajuste de recursos (CPU,
memória e workers do PHP) antes de um aumento de tráfego real.
