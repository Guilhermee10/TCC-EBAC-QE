// Page Object da página "Endereços" em Minha Conta
class EnderecosPage {
  elementos = {
    cartoesEndereco: () => cy.get('.woocommerce-Address'),
    campoFaturamento: (campo) => cy.get(`#billing_${campo}`),
    botaoSalvar: () => cy.get('[name="save_address"]'),
    mensagemSucesso: () => cy.get('.woocommerce-message'),
    mensagemErro: () => cy.get('.woocommerce-error'),
  }

  visitar() {
    cy.visit('/minha-conta/')
    cy.contains('.woocommerce-MyAccount-navigation a', 'Endereços').click()
  }

  // O primeiro cartão é o de faturamento; o link "Editar" abre o formulário
  editarFaturamento() {
    this.visitar()
    this.elementos.cartoesEndereco().first().find('a.edit').click()
  }

  preencherFaturamento(endereco) {
    const campo = this.elementos.campoFaturamento
    campo('first_name').clear().type(endereco.nome)
    campo('last_name').clear().type(endereco.sobrenome)
    // País e estado usam um componente visual (select2) por cima do <select> real.
    // O force: true seleciona direto no <select> escondido.
    campo('country').select(endereco.pais, { force: true })
    campo('address_1').clear().type(endereco.endereco)
    campo('city').clear().type(endereco.cidade)
    campo('state').select(endereco.estado, { force: true })
    campo('postcode').clear().type(endereco.cep)
    campo('phone').clear().type(endereco.telefone)
  }

  salvar() {
    this.elementos.botaoSalvar().click()
  }
}

export default new EnderecosPage()
