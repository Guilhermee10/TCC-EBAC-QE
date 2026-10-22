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

  it('CT-008 - Deve exibir erro ao informar senha incorreta', () => {
    cy.fixture('usuarios').then(({ senhaIncorreta }) => {
      loginPage.login(senhaIncorreta.usuario, senhaIncorreta.senha)
    })

    loginPage.elementos.mensagemErro().should('be.visible')
    // Garante que o login NÃO aconteceu: o menu do painel não pode existir
    minhaContaPage.elementos.menu().should('not.exist')
  })

  // BUG-001: a loja informa que o usuário "não está registrado" (enumeração de contas).
  // Reativar (trocar it.skip por it) quando o bug for corrigido.
  it.skip('CT-009 - [BUG-001] Não deve revelar se o usuário existe ao informar usuário inexistente', () => {
    cy.fixture('usuarios').then(({ inexistente }) => {
      loginPage.login(inexistente.usuario, inexistente.senha)
    })

    loginPage.elementos.mensagemErro()
      .should('be.visible')
      // Segurança (enumeração de usuários): a mensagem deve ser genérica
      .and('not.contain', 'não está registrado')
    minhaContaPage.elementos.menu().should('not.exist')
  })

  it('CT-010 - Deve exibir erro ao enviar o formulário com campos vazios', () => {
    loginPage.login('', '')

    loginPage.elementos.mensagemErro().should('be.visible')
    minhaContaPage.elementos.menu().should('not.exist')
  })
})