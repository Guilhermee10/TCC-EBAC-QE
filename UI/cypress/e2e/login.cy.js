/// <reference types="cypress" />
import loginPage from '../support/pages/login.page'
import minhaContaPage from '../support/pages/minha-conta.page'

// US-0002 - Login na plataforma
describe('US-0002 - Login na plataforma', () => {
  beforeEach(() => {
    loginPage.visitar()
  })

  it('CT-007 - Deve fazer login com sucesso com usuário ativo', () => {
    cy.fixture('usuarios').then(({ valido }) => {
      loginPage.login(valido.usuario, valido.senha)
    })

    cy.url().should('include', '/minha-conta')
    minhaContaPage.elementos.conteudo().should('contain', 'Olá')
    minhaContaPage.elementos.menu().should('be.visible').and('contain', 'Pedidos')
  })
})
