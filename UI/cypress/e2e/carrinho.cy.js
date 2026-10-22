/// <reference types="cypress" />
import produtoPage from '../support/pages/produto.page'
import carrinhoPage from '../support/pages/carrinho.page'

// US-0001 - Adicionar item ao carrinho
describe('US-0001 - Adicionar item ao carrinho', () => {
  let produto

  before(() => {
    // Carrega a massa de dados uma vez para todos os testes
    cy.fixture('produtos').then((dados) => {
      produto = dados.hoodie
    })
  })

  beforeEach(() => {
    produtoPage.abrir(produto.nome)
  })

  it('CT-001 - Deve adicionar produto ao carrinho com sucesso', () => {
    produtoPage.adicionarAoCarrinho(produto.tamanho, produto.cor, 1)

    produtoPage.elementos.mensagemSucesso()
      .should('be.visible')
      .and('contain', produto.nome)

    carrinhoPage.visitar()
    carrinhoPage.elementos.itens().should('have.length', 1).and('contain', produto.nome)
    carrinhoPage.elementos.quantidadeDoItem().should('have.value', '1')
  })

  it('CT-002 - Deve permitir adicionar a quantidade máxima de 10 unidades', () => {
    produtoPage.adicionarAoCarrinho(produto.tamanho, produto.cor, 10)

    produtoPage.elementos.mensagemSucesso().should('be.visible')

    carrinhoPage.visitar()
    carrinhoPage.elementos.quantidadeDoItem().should('have.value', '10')
  })

  // BUG-002: a loja permite adicionar mais de 10 unidades do mesmo produto.
  // Reativar (trocar it.skip por it) quando o bug for corrigido.
  it.skip('CT-003 - [BUG-002] Não deve permitir adicionar mais de 10 unidades do mesmo produto', () => {
    produtoPage.adicionarAoCarrinho(produto.tamanho, produto.cor, 11)

    produtoPage.elementos.mensagemErro().should('be.visible')

    // O efeito que importa: o produto NÃO pode ter entrado no carrinho
    carrinhoPage.visitar()
    carrinhoPage.elementos.carrinhoVazio().should('be.visible')
  })

  it('CT-004 - Não deve adicionar produto sem selecionar tamanho e cor', () => {
    // O WooCommerce avisa com um alert() do navegador.
    // Substituímos o window.alert da loja por um stub ("espião") para verificar o texto.
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alerta')
    })

    produtoPage.clicarComprar()

    cy.get('@alerta').should('have.been.calledOnce')
    cy.get('@alerta').its('firstCall.args.0').should('contain', 'Selecione')
    produtoPage.elementos.mensagemSucesso().should('not.exist')
  })
})
