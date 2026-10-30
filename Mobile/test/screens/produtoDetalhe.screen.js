// Screen Object da tela de detalhes do produto (visão do lojista: tela de edição)
class ProdutoDetalheScreen {
  get tela() {
    return $('id:productDetail_root')
  }

  // O nome do produto é um campo editável (o lojista abre o produto para editar)
  get campoNome() {
    return $('id:editText')
  }

  // Várias fotos usam o mesmo id: $$ retorna TODAS
  get imagens() {
    return $$('id:productImage')
  }

  get rotuloDescricao() {
    return $('android=new UiSelector().text("Description")')
  }

  // O id "textPropertyValue" se repete em todas as propriedades (Description,
  // Variations, Inventory...). O XPath pega o valor que vem LOGO DEPOIS do
  // rótulo "Description". XPath é o último recurso: mais lento e mais frágil.
  get descricao() {
    return $(
      '//*[@text="Description"]/following-sibling::*[@resource-id="com.woocommerce.android:id/textPropertyValue"]',
    )
  }

  get rotuloVariacoes() {
    return $('android=new UiSelector().text("Variations")')
  }

  async aguardarTela() {
    await this.tela.waitForDisplayed()
  }
}

export default new ProdutoDetalheScreen()
