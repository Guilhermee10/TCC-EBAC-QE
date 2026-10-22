/// <reference types="cypress" />
import enderecosPage from '../support/pages/enderecos.page'

// US-0007 - Endereços
describe('US-0007 - Endereços', () => {
  let cliente
  let endereco

  before(() => {
    cy.fixture('enderecos').then((dados) => {
      endereco = dados.faturamento
    })
    cy.cadastrarUsuario().then((dados) => {
      cliente = dados
    })
  })

  beforeEach(() => {
    cy.login(cliente.email, cliente.senha)
    enderecosPage.editarFaturamento()
  })

  it('CT-038 - Deve cadastrar o endereço de faturamento com sucesso', () => {
    enderecosPage.preencherFaturamento(endereco)
    enderecosPage.salvar()

    enderecosPage.elementos.mensagemSucesso()
      .should('be.visible')
      .and('contain', 'Endereço alterado com sucesso')
    enderecosPage.elementos.cartoesEndereco().first()
      .should('contain', endereco.endereco)
      .and('contain', endereco.cidade)
  })

  // Teste orientado a dados: o mesmo teste roda uma vez para cada campo da lista
  const camposObrigatorios = [
    { id: 'first_name', rotulo: 'Nome' },
    { id: 'address_1', rotulo: 'Endereço' },
    { id: 'city', rotulo: 'Cidade' },
    { id: 'postcode', rotulo: 'CEP' },
  ]

  camposObrigatorios.forEach(({ id, rotulo }) => {
    it(`CT-039 - Deve exigir o campo obrigatório "${rotulo}"`, () => {
      enderecosPage.preencherFaturamento(endereco)
      enderecosPage.elementos.campoFaturamento(id).clear()
      enderecosPage.salvar()

      enderecosPage.elementos.mensagemErro()
        .should('be.visible')
        .and('contain', rotulo)
        .and('contain', 'obrigatório')
    })
  })
})
