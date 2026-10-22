// Page Object do catálogo de produtos (lista e resultados de busca)
class CatalogoPage {
  elementos = {
    produtos: () => cy.get('.product-block'),
    mensagemInfo: () => cy.get('.woocommerce-info'),
  }

  visitar() {
    cy.visit('/produtos/')
  }

  // Busca de produtos da loja (mesma URL que o campo de busca gera)
  buscar(termo) {
    cy.visit(`/?s=${encodeURIComponent(termo)}&post_type=product`)
  }
}

export default new CatalogoPage()
