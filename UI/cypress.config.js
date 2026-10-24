const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // Relatório HTML gerado ao rodar "cypress run"
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'TCC EBAC QE - Testes de UI',
    charts: true,
    embeddedScreenshots: true, // print das falhas dentro do relatório
    inlineAssets: true, // relatório em um único arquivo HTML, fácil de compartilhar
  },
  e2e: {
    // Endereço da loja: nos testes usamos só o caminho, ex: cy.visit('/minha-conta/')
    baseUrl: 'http://lojaebac.ebaconline.art.br',
    // Tamanho de tela de um notebook comum
    viewportWidth: 1280,
    viewportHeight: 800,
    // A loja de teste pode ser lenta: damos até 10s para cada elemento aparecer
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // Plugin que monta o relatório ao final da execução
      require('cypress-mochawesome-reporter/plugin')(on)
    },
  },
})