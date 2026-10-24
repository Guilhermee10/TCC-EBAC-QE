// Screen Object: painel "My store", primeira tela após o login
class MinhaLojaScreen {
  // Nome da loja na barra superior: identificador único (resource-id)
  get nomeDaLoja() {
    return $('id:toolbar_subtitle')
  }

  async estaVisivel() {
    await this.nomeDaLoja.waitForDisplayed()
    return this.nomeDaLoja.isDisplayed()
  }
}

export default new MinhaLojaScreen()