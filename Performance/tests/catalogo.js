// PERF-02 - Navegação no catálogo de produtos sob carga (US-0004)
import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { BASE_URL, opcoes } from '../config/opcoes.js'

export const options = opcoes

const PRODUTO = 'Abominable Hoodie'

export default function () {
  group('Listar produtos', () => {
    const resposta = http.get(`${BASE_URL}/produtos/`)

    check(resposta, {
      'catálogo: status 200': (r) => r.status === 200,
      'catálogo: produtos exibidos': (r) => r.body.includes('product-block'),
    })
  })

  sleep(1)

  group('Abrir detalhes do produto', () => {
    // Mesma estratégia da UI: a busca com resultado único abre direto o produto
    const resposta = http.get(`${BASE_URL}/?s=${encodeURIComponent(PRODUTO)}&post_type=product`)

    check(resposta, {
      'produto: status 200': (r) => r.status === 200,
      'produto: página do produto exibida': (r) => r.body.includes('single_add_to_cart_button'),
    })
  })

  sleep(1)
}
