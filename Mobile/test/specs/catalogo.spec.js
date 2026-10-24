// US-0004 - Catálogo de produtos (Mobile - Android)
// No app do lojista, o catálogo é a aba "Products"
import inicioScreen from '../screens/inicio.screen.js'
import loginScreen from '../screens/login.screen.js'
import minhaLojaScreen from '../screens/minhaLoja.screen.js'
import navegacaoScreen from '../screens/navegacao.screen.js'
import produtosScreen from '../screens/produtos.screen.js'

describe('US-0004 - Catálogo de produtos (Mobile)', () => {
  before(async () => {
    // Pré-condição: lojista autenticado no app
    await inicioScreen.irParaLogin()
    await loginScreen.informarEnderecoDaLoja(process.env.STORE_URL)
    await loginScreen.login(process.env.MOBILE_USER, process.env.MOBILE_PASSWORD)
    await minhaLojaScreen.estaVisivel()
  })

  it('CT-023 - Deve exibir a lista de produtos com imagem, nome e estoque', async () => {
    await navegacaoScreen.irParaProdutos()
    await produtosScreen.aguardarLista()

    const itens = await produtosScreen.itens
    expect(itens.length).toBeGreaterThan(0)

    // Verifica os 3 primeiros itens: o último visível pode estar cortado na borda da tela
    for (const item of itens.slice(0, 3)) {
      await expect(produtosScreen.imagemDoItem(item)).toBeDisplayed()
      await expect(produtosScreen.estoqueDoItem(item)).toBeDisplayed()

      const nome = await produtosScreen.nomeDoItem(item).getText()
      expect(nome.trim()).not.toBe('')
    }
  })
})
