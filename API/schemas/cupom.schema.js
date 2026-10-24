// CONTRATOS da API de cupons, escritos com Joi.
// Validamos os campos dos quais dependemos, com os tipos corretos.
// .unknown(true) aceita campos extras: se a API ganhar um campo novo,
// o contrato não quebra (mudança compatível); se um campo mudar de TIPO, quebra.
const Joi = require('joi')

const cupomSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  code: Joi.string().required(),
  amount: Joi.string().required(), // a API devolve valores como texto, ex: "10.00"
  discount_type: Joi.string().valid('percent', 'fixed_cart', 'fixed_product').required(),
  description: Joi.string().allow('').required(),
  date_created: Joi.string().allow(null).required(),
  usage_count: Joi.number().integer().min(0).required(),
  individual_use: Joi.boolean().required(),
  product_ids: Joi.array().items(Joi.number()).required(),
}).unknown(true)

const listaCuponsSchema = Joi.array().items(cupomSchema)

// Formato padrão de erro da API do WordPress/WooCommerce
const erroSchema = Joi.object({
  code: Joi.string().required(),
  message: Joi.string().required(),
  data: Joi.object({
    status: Joi.number().integer().required(),
  }).unknown(true),
}).unknown(true)

module.exports = { cupomSchema, listaCuponsSchema, erroSchema }
