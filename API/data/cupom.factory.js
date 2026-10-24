// "Fábrica" de cupons: cada chamada gera um cupom com código ÚNICO.
// Assim os testes podem rodar quantas vezes for preciso sem esbarrar
// em cupons criados por execuções anteriores (regra: código não pode repetir).
const gerarCupom = (sobrescrever = {}) => ({
  code: `Cupom_TCC_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  amount: '10.00',
  discount_type: 'fixed_product',
  description: 'Cupom de teste - TCC EBAC QE',
  ...sobrescrever, // permite trocar qualquer campo, ex: gerarCupom({ amount: '20.00' })
})

module.exports = { gerarCupom }
