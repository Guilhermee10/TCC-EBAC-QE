// Teste de fumaça (smoke test): valida que o ambiente mobile está funcionando
// e que o login do lojista, pré-condição dos testes de catálogo, acontece.
import inicioScreen from '../screens/inicio.screen.js'
import loginScreen from '../screens/login.screen.js'
import minhaLojaScreen from '../screens/minhaLoja.screen.js'

describe('Mobile - Acesso ao painel da loja', () => {
  it('Deve fazer login como lojista e exibir o painel da loja', async () => {
    await inicioScreen.irParaLogin()
    await loginScreen.informarEnderecoDaLoja(process.env.STORE_URL)
    await loginScreen.login(process.env.MOBILE_USER, process.env.MOBILE_PASSWORD)

    expect(await minhaLojaScreen.estaVisivel()).toBe(true)
    await expect(minhaLojaScreen.nomeDaLoja).toHaveText('EBAC - Shop')
  })
})
