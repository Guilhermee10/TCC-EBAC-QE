// Screen Object da aba "Products" (catálogo de produtos do lojista)
class ProdutosScreen {
  get lista() {
    return $('id:productsRecycler')
  }

  // Cada produto da lista. O RecyclerView só cria os itens VISÍVEIS na tela
  // (virtualização), então esta lista traz apenas o que está aparecendo.
  get itens() {
    return this.lista.$$('id:linearLayout')
  }

  // Busca encadeada: o id "productName" se repete em todos os itens,
  // então buscamos DENTRO de um item específico
  nomeDoItem(item) {
    return item.$('id:productName')
  }

  estoqueDoItem(item) {
    return item.$('id:productStockAndStatus')
  }

  imagemDoItem(item) {
    return item.$('id:productImageFrame')
  }

  // Rola a lista até encontrar o produto pelo nome e toca nele.
  // UiScrollable é um recurso nativo do Android: ele mesmo faz a rolagem.
  // Fica aqui (e não no detalhe) porque é uma ação da tela de LISTA.
  async abrirProduto(nome) {
    const produto = await $(
      `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${nome}"))`,
    )
    await produto.click()
  }

  async aguardarLista() {
    await this.lista.waitForDisplayed()
  }
}

export default new ProdutosScreen()
