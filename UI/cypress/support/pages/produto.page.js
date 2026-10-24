// Page Object da página de detalhes do produto
class ProdutoPage {
  elementos = {
    // Seletores com parâmetro: o mesmo método serve para qualquer tamanho/cor
    opcaoTamanho: (tamanho) => cy.get(`.button-variable-item-${tamanho}`),
    opcaoCor: (cor) => cy.get(`.button-variable-item-${cor}`),
    campoQuantidade: () => cy.get('input.qty'),
    botaoComprar: () => cy.get('.single_add_to_cart_button'),
    mensagemSucesso: () => cy.get('.woocommerce-message'),
    mensagemErro: () => cy.get('.woocommerce-error'),
    titulo: () => cy.get('.product_title'),
    preco: () => cy.get('.summary .price'),
    descricao: () => cy.get('.woocommerce-product-details__short-description'),
  }

  // Usa a busca da loja: quando o resultado é único, o WooCommerce abre direto
  // a página do produto. Assim não dependemos do formato da URL de cada produto.
  abrir(nomeProduto) {
    cy.visit(`/?s=${encodeURIComponent(nomeProduto)}&post_type=product`)
    // Sinal de que o JavaScript de variações da loja terminou de carregar:
    // ele adiciona esta classe ao botão. Sem isso, o teste pode clicar antes
    // do script estar pronto (condição de corrida), o que já aconteceu na CI.
    this.elementos.botaoComprar().should('have.class', 'wc-variation-selection-needed')
  }

  selecionarOpcoes(tamanho, cor) {
    this.elementos.opcaoTamanho(tamanho).click()
    this.elementos.opcaoCor(cor).click()
    // Combinação válida selecionada: o script habilita o botão Comprar
    this.elementos.botaoComprar().should('not.have.class', 'disabled')
  }

  informarQuantidade(quantidade) {
    this.elementos.campoQuantidade().clear().type(quantidade)
  }

  clicarComprar() {
    this.elementos.botaoComprar().click()
  }

  // Fluxo completo, reaproveitado pelos testes
  adicionarAoCarrinho(tamanho, cor, quantidade) {
    this.selecionarOpcoes(tamanho, cor)
    this.informarQuantidade(quantidade)
    this.clicarComprar()
  }
}

export default new ProdutoPage()
