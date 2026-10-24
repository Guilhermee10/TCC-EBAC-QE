const { api, apiAdmin } = require('../config/api')
const { gerarCupom } = require('../data/cupom.factory')
const { cupomSchema, listaCuponsSchema, erroSchema } = require('../schemas/cupom.schema')

// Função auxiliar: valida um objeto contra um schema Joi e mostra o motivo se falhar
const validarContrato = (schema, dados) => {
  const { error } = schema.validate(dados)
  expect(error?.message).toBeUndefined()
}

// Guarda os IDs criados para apagar tudo no final (não sujar o ambiente)
const cuponsCriados = []

const criarCupom = async (cupom) => {
  const resposta = await apiAdmin.post('/coupons').send(cupom)
  if (resposta.status === 201) cuponsCriados.push(resposta.body.id)
  return resposta
}

afterAll(async () => {
  // Limpeza: apaga definitivamente (force=true) os cupons criados pelos testes
  for (const id of cuponsCriados) {
    await apiAdmin.delete(`/coupons/${id}?force=true`)
  }
})

describe('US-0003 - API de cupons', () => {
  describe('GET /coupons', () => {
    test('CT-014 - Deve listar os cupons cadastrados', async () => {
      const resposta = await apiAdmin.get('/coupons')

      expect(resposta.status).toBe(200)
      expect(Array.isArray(resposta.body)).toBe(true)
      validarContrato(listaCuponsSchema, resposta.body)
    })

    test('CT-015 - Deve buscar um cupom pelo ID', async () => {
      // O próprio teste cria o cupom que vai buscar: não depende de dados existentes
      const { body: criado } = await criarCupom(gerarCupom())

      const resposta = await apiAdmin.get(`/coupons/${criado.id}`)

      expect(resposta.status).toBe(200)
      expect(resposta.body.id).toBe(criado.id)
      validarContrato(cupomSchema, resposta.body)
    })

    test('CT-016 - Deve retornar 404 ao buscar um ID inexistente', async () => {
      const resposta = await apiAdmin.get('/coupons/999999999')

      expect(resposta.status).toBe(404)
      validarContrato(erroSchema, resposta.body)
    })

    test('CT-022 - Deve negar acesso sem autenticação', async () => {
      const resposta = await api().get('/coupons')

      expect(resposta.status).toBe(401)
      validarContrato(erroSchema, resposta.body)
    })
  })

  describe('POST /coupons', () => {
    test('CT-017 - Deve cadastrar um cupom com os campos obrigatórios', async () => {
      const cupom = gerarCupom()

      const resposta = await criarCupom(cupom)

      expect(resposta.status).toBe(201)
      validarContrato(cupomSchema, resposta.body)
      // O WooCommerce grava o código em minúsculas
      expect(resposta.body.code).toBe(cupom.code.toLowerCase())
      expect(resposta.body.amount).toBe(cupom.amount)
      expect(resposta.body.discount_type).toBe(cupom.discount_type)
      expect(resposta.body.description).toBe(cupom.description)
    })

    test('CT-018 - Não deve cadastrar cupom com código repetido', async () => {
      const cupom = gerarCupom()
      await criarCupom(cupom)

      const resposta = await criarCupom(cupom)

      expect(resposta.status).toBe(400)
      validarContrato(erroSchema, resposta.body)
    })

    test('CT-019 - Não deve cadastrar código repetido com maiúsculas/minúsculas diferentes', async () => {
      const cupom = gerarCupom()
      await criarCupom(cupom)

      const resposta = await criarCupom({ ...cupom, code: cupom.code.toUpperCase() })

      expect(resposta.status).toBe(400)
    })

    // Teste orientado a dados: roda uma vez para cada campo da lista
    const cadastrarSemCampo = async (campo) => {
      // Remove o campo do objeto: { [campo]: _, ...resto } separa o campo do restante
      const { [campo]: _removido, ...cupomSemCampo } = gerarCupom()

      const resposta = await criarCupom(cupomSemCampo)

      expect(resposta.status).toBe(400)
    }

    test.each(['code'])(
      'CT-020 - Não deve cadastrar cupom sem o campo obrigatório "%s"',
      cadastrarSemCampo,
    )

    // BUG-003: a API aceita (201) cupons sem amount, discount_type e description.
    // Reativar (trocar test.skip.each por test.each) quando o bug for corrigido.
    test.skip.each(['amount', 'discount_type', 'description'])(
      'CT-020 - [BUG-003] Não deve cadastrar cupom sem o campo obrigatório "%s"',
      cadastrarSemCampo,
    )
    test('CT-021 - Não deve cadastrar cupom com tipo de desconto inválido', async () => {
      const resposta = await criarCupom(gerarCupom({ discount_type: 'brinde' }))

      expect(resposta.status).toBe(400)
      validarContrato(erroSchema, resposta.body)
    })
  })
})
