// Screen Object: fluxo de login do app (lojista)
// Seletores baseados no projeto de exemplo da EBAC (EBAC-QE/testes-mobile-ebac-shop)
class LoginScreen {
  get campoEnderecoDaLoja() {
    return $('android.widget.EditText')
  }
  get botaoContinuar() {
    return $('id:bottom_button')
  }
  get botaoEntrarComCredenciaisDaLoja() {
    return $('id:login_site_creds')
  }
  // UiSelector: busca pelo texto exibido no campo, recurso nativo do Android
  get campoUsuario() {
    return $('android=new UiSelector().text("Username")')
  }
  get campoSenha() {
    return $('android=new UiSelector().text("Password")')
  }
  get botaoEntrarComSenha() {
    return $('id:login_enter_password')
  }

  async informarEnderecoDaLoja(url) {
    await this.campoEnderecoDaLoja.setValue(url)
    await this.botaoContinuar.click()
  }

  async login(usuario, senha) {
    await this.botaoEntrarComCredenciaisDaLoja.click()
    await this.campoUsuario.setValue(usuario)
    await this.campoSenha.setValue(senha)
    await this.botaoContinuar.click()
    // O app pede a senha uma segunda vez (etapa de verificação)
    await this.botaoEntrarComSenha.click()
    await this.campoSenha.setValue(senha)
    await this.botaoContinuar.click()
  }
}

export default new LoginScreen()
