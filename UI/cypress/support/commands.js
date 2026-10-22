import loginPage from './pages/login.page'
import minhaContaPage from './pages/minha-conta.page'

// Login com cache de sessão: o login pela tela acontece uma vez por usuário,
// depois o Cypress restaura os cookies. Uso: cy.login(usuario, senha)
Cypress.Commands.add('login', (usuario, senha) => {
    cy.session(usuario, () => {
        loginPage.visitar()
        loginPage.login(usuario, senha)
        minhaContaPage.elementos.menu().should('be.visible')
    })
})

// Cadastra um cliente novo e devolve { email, senha }.
// O timestamp garante um e-mail diferente a cada execução.
Cypress.Commands.add('cadastrarUsuario', () => {
    const email = `tcc_qe_${Date.now()}@teste.com`
    const senha = 'Tcc@Ebac2026!'

    cy.visit('/minha-conta/')
    cy.get('#reg_email').type(email)
    cy.get('#reg_password').type(senha, { log: false })
    cy.get('[name="register"]').click()
    minhaContaPage.elementos.menu().should('be.visible')

    return cy.wrap({ email, senha })
})