// US-0004 - Catálogo de produtos (Mobile - Android)
// No app do lojista, o catálogo é a aba "Products"
import inicioScreen from '../screens/inicio.screen.js'
import loginScreen from '../screens/login.screen.js'
import minhaLojaScreen from '../screens/minhaLoja.screen.js'
import navegacaoScreen from '../screens/navegacao.screen.js'
import produtosScreen from '../screens/produtos.screen.js'
import produtoDetalheScreen from '../screens/produtoDetalhe.screen.js'

describe('US-0004 - Catálogo de produtos (Mobile)', () => {
  // Produto conhecido da loja (o mesmo da fixture da UI web).
  // Declarado no escopo do describe para ficar acessível a todos os testes.
  // Evita depender do "primeiro da lista", que muda com produtos criados por terceiros.
  const PRODUTO = 'Abominable Hoodie'

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

  it('CT-024 - Deve exibir os detalhes do produto', async () => {
    // Ponto de partida conhecido: não depende de onde o teste anterior parou
    await navegacaoScreen.irParaProdutos()
    await produtosScreen.aguardarLista()
    await produtosScreen.abrirProduto(PRODUTO)

    await produtoDetalheScreen.aguardarTela()

    await expect(produtoDetalheScreen.campoNome).toHaveText(PRODUTO)

    const imagens = await produtoDetalheScreen.imagens
    expect(imagens.length).toBeGreaterThan(0)

    await expect(produtoDetalheScreen.rotuloDescricao).toBeDisplayed()
    const descricao = await produtoDetalheScreen.descricao.getText()
    expect(descricao.trim()).not.toBe('')

    // No app do lojista, produto variável mostra as variações (tamanho x cor)
    await expect(produtoDetalheScreen.rotuloVariacoes).toBeDisplayed()
  })
})
