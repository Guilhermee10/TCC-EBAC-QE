// Page Object da página "Pedidos" em Minha Conta
class PedidosPage {
  elementos = {
    aviso: () => cy.get('.woocommerce-info'),
    tabelaPedidos: () => cy.get('.woocommerce-orders-table'),
  }

  // Navega pelo menu, como o cliente faria (não depende do formato da URL)
  visitar() {
    cy.visit('/minha-conta/')
    cy.contains('.woocommerce-MyAccount-navigation a', 'Pedidos').click()
  }
}

export default new PedidosPage()
