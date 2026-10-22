// Page Object da página "Endereços" em Minha Conta
class EnderecosPage {
  elementos = {
    // O tema da loja não usa a classe padrão .woocommerce-Address;
    // o texto do endereço salvo sempre fica dentro de uma tag <address>
    cartoesEndereco: () => cy.get('.woocommerce-MyAccount-content address'),
    campoFaturamento: (campo) => cy.get(`#billing_${campo}`),
    botaoSalvar: () => cy.get('[name="save_address"]'),
    mensagemSucesso: () => cy.get('.woocommerce-message'),
    mensagemErro: () => cy.get('.woocommerce-error'),
  }

  visitar() {
    cy.visit('/minha-conta/')
    cy.contains('.woocommerce-MyAccount-navigation a', 'Endereços').click()
  }

  // O primeiro link "Editar"/"Adicionar" da página é o do endereço de faturamento
  editarFaturamento() {
    this.visitar()
    cy.get('.woocommerce-MyAccount-content a.edit').first().click()
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
