// Page Object do painel Minha Conta (usuário logado)
class MinhaContaPage {
  elementos = {
    menu: () => cy.get('.woocommerce-MyAccount-navigation'),
    conteudo: () => cy.get('.woocommerce-MyAccount-content'),
  }
}

export default new MinhaContaPage()
