const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Endereço da loja: nos testes usamos só o caminho, ex: cy.visit('/minha-conta/')
    baseUrl: 'http://lojaebac.ebaconline.art.br',
    // Tamanho de tela de um notebook comum
    viewportWidth: 1280,
    viewportHeight: 800,
    // A loja de teste pode ser lenta: damos até 10s para cada elemento aparecer
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // plugins (ex: relatórios) serão configurados aqui
    },
  },
})
