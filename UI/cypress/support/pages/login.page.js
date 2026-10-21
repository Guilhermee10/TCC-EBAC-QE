// Page Object da tela de login (Minha Conta, usuário deslogado)
class LoginPage {
  // Seletores em um só lugar: se a loja mudar, só alteramos aqui
  elementos = {
    campoUsuario: () => cy.get('#username'),
    campoSenha: () => cy.get('#password'),
    botaoLogin: () => cy.get('[name="login"]'),
    mensagemErro: () => cy.get('.woocommerce-error'),
  }

  visitar() {
    cy.visit('/minha-conta/')
  }

  login(usuario, senha) {
    if (usuario) this.elementos.campoUsuario().type(usuario)
    // log: false evita que a senha apareça no log e nos vídeos do Cypress
    if (senha) this.elementos.campoSenha().type(senha, { log: false })
    this.elementos.botaoLogin().click()
  }
}

export default new LoginPage()
