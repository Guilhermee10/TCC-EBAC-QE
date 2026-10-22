/// <reference types="cypress" />
import pedidosPage from '../support/pages/pedidos.page'

// US-0006 - Meus pedidos
describe('US-0006 - Meus pedidos', () => {
  let cliente

  before(() => {
    // Um cliente recém-cadastrado garantidamente não tem pedidos
    cy.cadastrarUsuario().then((dados) => {
      cliente = dados
    })
  })

  beforeEach(() => {
    cy.login(cliente.email, cliente.senha)
  })

  it('CT-036 - Deve informar quando o cliente não possui pedidos', () => {
    pedidosPage.visitar()

    pedidosPage.elementos.aviso()
      .should('be.visible')
      .and('contain', 'Nenhum pedido')
    // O aviso traz um link para o cliente voltar a navegar pelos produtos
    pedidosPage.elementos.aviso().find('a').should('be.visible')
    pedidosPage.elementos.tabelaPedidos().should('not.exist')
  })
})
