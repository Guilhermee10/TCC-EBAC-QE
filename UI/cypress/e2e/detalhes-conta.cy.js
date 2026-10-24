/// <reference types="cypress" />
import detalhesContaPage from '../support/pages/detalhes-conta.page'
import minhaContaPage from '../support/pages/minha-conta.page'

// US-0008 - Detalhes da conta
describe('US-0008 - Detalhes da conta', () => {
  let cliente
  const dadosPessoais = {
    nome: 'Guilherme',
    sobrenome: 'Santos',
    nomeExibicao: 'Guilherme QA',
  }

  before(() => {
    cy.cadastrarUsuario().then((dados) => {
      cliente = dados
    })
  })

  beforeEach(() => {
    cy.login(cliente.email, cliente.senha)
    detalhesContaPage.visitar()
  })

  it('CT-042 - Deve atualizar o nome de exibição com sucesso', () => {
    detalhesContaPage.preencherDados(dadosPessoais)
    detalhesContaPage.salvar()

    detalhesContaPage.elementos.mensagemSucesso()
      .should('be.visible')
      .and('contain', 'modificados com sucesso')
    // Validação do EFEITO: a saudação do painel passa a usar o novo nome
    minhaContaPage.elementos.conteudo().should('contain', dadosPessoais.nomeExibicao)
  })

  // Formatos inválidos: o próprio navegador bloqueia o envio (input type="email")
  const emailsComFormatoInvalido = ['guilhermeemail.com', 'guilherme@']

  emailsComFormatoInvalido.forEach((email) => {
    it(`CT-043 - Não deve aceitar o e-mail com formato inválido "${email}"`, () => {
      detalhesContaPage.preencherDados(dadosPessoais)
      detalhesContaPage.informarEmail(email)
      detalhesContaPage.salvar()

      // O navegador marca o campo como inválido e o formulário não é enviado
      detalhesContaPage.elementos.campoEmail().then(($campo) => {
        expect($campo[0].validity.valid).to.be.false
      })
      detalhesContaPage.elementos.mensagemSucesso().should('not.exist')
    })
  })

  it('CT-043 - Não deve aceitar o e-mail vazio', () => {
    detalhesContaPage.preencherDados(dadosPessoais)
    detalhesContaPage.informarEmail('')
    detalhesContaPage.salvar()

    // Campo vazio passa pelo navegador e é barrado pelo servidor da loja
    detalhesContaPage.elementos.mensagemErro()
      .should('be.visible')
      .and('contain', 'obrigatório')
    detalhesContaPage.elementos.mensagemSucesso().should('not.exist')
  })
})
