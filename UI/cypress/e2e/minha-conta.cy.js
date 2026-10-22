/// <reference types="cypress" />
import loginPage from '../support/pages/login.page'
import minhaContaPage from '../support/pages/minha-conta.page'

// US-0005 - Painel Minha Conta
describe('US-0005 - Painel Minha Conta', () => {
  context('Cliente autenticado', () => {
    beforeEach(() => {
      cy.fixture('usuarios').then(({ valido }) => {
        // cy.session faz o login UMA vez e reaproveita os cookies nos próximos testes.
        // O login de verdade já é testado no CT-007; aqui ele é só pré-condição.
        cy.session(valido.usuario, () => {
          loginPage.visitar()
          loginPage.login(valido.usuario, valido.senha)
          minhaContaPage.elementos.menu().should('be.visible')
        })
      })
      cy.visit('/minha-conta/')
    })

    it('CT-030 - Deve exibir o painel com saudação ao cliente autenticado', () => {
      minhaContaPage.elementos.conteudo().should('be.visible').and('contain', 'Olá')
    })
  })

  context('Cliente não autenticado', () => {
    it('CT-032 - Deve exibir o formulário de login ao acessar Minha Conta sem estar logado', () => {
      cy.visit('/minha-conta/')

      loginPage.elementos.campoUsuario().should('be.visible')
      loginPage.elementos.campoSenha().should('be.visible')
      minhaContaPage.elementos.menu().should('not.exist')
    })
  })
})
