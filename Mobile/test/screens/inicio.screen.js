// Screen Object: tela inicial do app (antes do login)
// No mobile, o Page Object costuma se chamar "Screen Object"
class InicioScreen {
  get botaoEntrarComEnderecoDaLoja() {
    return $('id:button_login_store')
  }

  async irParaLogin() {
    await this.botaoEntrarComEnderecoDaLoja.click()
  }
}

export default new InicioScreen()
