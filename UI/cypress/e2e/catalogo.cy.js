/// <reference types="cypress" />
import catalogoPage from '../support/pages/catalogo.page'
import produtoPage from '../support/pages/produto.page'

// US-0004 - Catálogo de produtos
describe('US-0004 - Catálogo de produtos', () => {
  it('CT-023 - Deve exibir a lista de produtos com imagem e preço', () => {
    catalogoPage.visitar()

    catalogoPage.elementos.produtos()
      .should('have.length.greaterThan', 0)
      // .each percorre CADA produto da lista e aplica as verificações
      .each(($produto) => {
        cy.wrap($produto).find('img').should('be.visible')
        cy.wrap($produto).should('contain', 'R$')
      })
  })

  it('CT-024 - Deve exibir os detalhes do produto', () => {
    // Usamos um produto conhecido da fixture: no ambiente compartilhado,
    // "o primeiro da lista" muda conforme outras pessoas criam produtos.
    cy.fixture('produtos').then(({ hoodie }) => {
      produtoPage.abrir(hoodie.nome)

      produtoPage.elementos.titulo().should('have.text', hoodie.nome)
      produtoPage.elementos.preco().should('contain', 'R$')
      produtoPage.elementos.descricao().should('be.visible')
      produtoPage.elementos.opcaoTamanho(hoodie.tamanho).should('be.visible')
      produtoPage.elementos.opcaoCor(hoodie.cor).should('be.visible')
      produtoPage.elementos.botaoComprar().should('be.visible')
    })
  })

  it('CT-025 - Deve encontrar um produto existente pela busca', () => {
    cy.fixture('produtos').then(({ hoodie }) => {
      catalogoPage.buscar(hoodie.nome)
      // Resultado único: a loja abre direto a página do produto
      produtoPage.elementos.titulo().should('have.text', hoodie.nome)
    })
  })

  it('CT-026 - Deve informar quando a busca não encontra produtos', () => {
    catalogoPage.buscar('produtoinexistente123')

    catalogoPage.elementos.mensagemInfo()
      .should('be.visible')
      .and('contain', 'Nenhum produto')
    catalogoPage.elementos.produtos().should('not.exist')
  })
})
