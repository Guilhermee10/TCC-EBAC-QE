// PERF-01 - Login na plataforma sob carga (US-0002)
import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { SharedArray } from 'k6/data'
import { BASE_URL, opcoes } from '../config/opcoes.js'

// SharedArray: a massa de dados é carregada UMA vez e compartilhada entre os VUs
// (sem isso, cada um dos 20 VUs teria a sua própria cópia na memória)
const usuarios = new SharedArray('usuarios', () => JSON.parse(open('../data/usuarios.json')))

export const options = opcoes

export default function () {
  // Distribui os 5 usuários entre os VUs: VU 1 -> user1, VU 2 -> user2, ..., VU 6 -> user1...
  const usuario = usuarios[(__VU - 1) % usuarios.length]

  // Cada iteração começa deslogada: limpa os cookies de sessão da iteração anterior
  http.cookieJar().clear(BASE_URL)

  let nonce

  group('Abrir página de login', () => {
    const resposta = http.get(`${BASE_URL}/minha-conta/`)

    check(resposta, {
      'página de login: status 200': (r) => r.status === 200,
    })

    // O WordPress exige um "nonce" (token de segurança de uso único) no formulário.
    // Lemos o valor do HTML da página, como o navegador faria.
    nonce = resposta.html().find('input[name="woocommerce-login-nonce"]').attr('value')
  })

  group('Enviar login', () => {
    const resposta = http.post(`${BASE_URL}/minha-conta/`, {
      username: usuario.usuario,
      password: usuario.senha,
      'woocommerce-login-nonce': nonce,
      _wp_http_referer: '/minha-conta/',
      login: 'Login',
    })

    check(resposta, {
      'login: status 200': (r) => r.status === 200,
      'login: painel Minha Conta exibido': (r) => r.body.includes('woocommerce-MyAccount-navigation'),
    })
  })

  // "Tempo de pensar" (think time): um usuário real não clica sem parar
  sleep(1)
}
