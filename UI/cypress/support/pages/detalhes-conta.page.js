// Page Object da página "Detalhes da conta" em Minha Conta
class DetalhesContaPage {
  elementos = {
    campoNome: () => cy.get('#account_first_name'),
    campoSobrenome: () => cy.get('#account_last_name'),
    campoNomeExibicao: () => cy.get('#account_display_name'),
    campoEmail: () => cy.get('#account_email'),
    botaoSalvar: () => cy.get('[name="save_account_details"]'),
    mensagemSucesso: () => cy.get('.woocommerce-message'),
    mensagemErro: () => cy.get('.woocommerce-error'),
  }

  visitar() {
    cy.visit('/minha-conta/')
    cy.contains('.woocommerce-MyAccount-navigation a', 'Detalhes da conta').click()
  }

  preencherDados({ nome, sobrenome, nomeExibicao }) {
    this.elementos.campoNome().clear().type(nome)
    this.elementos.campoSobrenome().clear().type(sobrenome)
    this.elementos.campoNomeExibicao().clear().type(nomeExibicao)
  }

  informarEmail(email) {
    this.elementos.campoEmail().clear()
    if (email) this.elementos.campoEmail().type(email)
  }

  salvar() {
    this.elementos.botaoSalvar().click()
  }
}

export default new DetalhesContaPage()
