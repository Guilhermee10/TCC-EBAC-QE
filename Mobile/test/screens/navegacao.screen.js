// Screen Object da barra de navegação inferior do app (presente em várias telas)
class NavegacaoScreen {
  // Usamos o contêiner da aba (id único), e não o ícone (id "icon" se repete nas 4 abas)
  get abaProdutos() {
    return $('id:products')
  }

  async irParaProdutos() {
    await this.abaProdutos.click()
  }
}

export default new NavegacaoScreen()
