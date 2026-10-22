// Page Object da página do carrinho
class CarrinhoPage {
  elementos = {
    itens: () => cy.get('.cart_item'),
    quantidadeDoItem: () => cy.get('.cart_item input.qty'),
    carrinhoVazio: () => cy.get('.cart-empty'),
  }

  visitar() {
    cy.visit('/carrinho/')
  }
}

export default new CarrinhoPage()
