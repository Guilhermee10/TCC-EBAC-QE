// Configuração central da API: endereço e autenticação em um só lugar
require('dotenv').config()
const request = require('supertest')

const BASE_URL = process.env.API_BASE_URL || 'http://lojaebac.ebaconline.art.br/wp-json/wc/v3'
const USUARIO = process.env.API_USER
const SENHA = process.env.API_PASSWORD

// Falha rápido e com mensagem clara se as credenciais não foram configuradas
if (!USUARIO || !SENHA) {
  throw new Error('Defina API_USER e API_PASSWORD no arquivo API/.env (use o .env.example como modelo)')
}

// Requisição SEM autenticação (usada no teste de acesso negado)
const api = () => request(BASE_URL)

// Requisições COM autenticação Basic do administrador
const apiAdmin = {
  get: (rota) => api().get(rota).auth(USUARIO, SENHA),
  post: (rota) => api().post(rota).auth(USUARIO, SENHA),
  delete: (rota) => api().delete(rota).auth(USUARIO, SENHA),
}

module.exports = { api, apiAdmin }
