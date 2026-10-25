// Configuração de carga compartilhada pelos testes de performance (requisitos do TCC)
export const BASE_URL = __ENV.BASE_URL || 'http://lojaebac.ebaconline.art.br'

export const opcoes = {
  // Perfil de carga: 20 usuários virtuais, 2 minutos no total, ramp-up de 20 segundos
  stages: [
    { duration: '20s', target: 20 }, // ramp-up: sobe de 0 a 20 VUs em 20s
    { duration: '1m40s', target: 20 }, // carga estável: 20 VUs até completar 2 minutos
  ],

  // Critérios de aprovação: se algum for violado, o K6 termina com erro
  thresholds: {
    http_req_failed: ['rate<0.01'], // menos de 1% de requisições com erro
    http_req_duration: ['p(95)<3000'], // 95% das requisições em até 3 segundos
    checks: ['rate>0.99'], // mais de 99% das verificações devem passar
  },
}
