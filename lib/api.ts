// Serviços de API para o Backend Java Spring Boot
const API_BASE_URL = 'http://localhost:8080/api'

import type {
  Investidor,
  Carteira,
  CarteiraResumo,
  AtivoFinanceiro,
  Transacao,
} from './types'

// ============ INVESTIDORES ============

export async function criarInvestidor(data: { nome: string; email: string }): Promise<Investidor> {
  const response = await fetch(`${API_BASE_URL}/investidores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao criar investidor')
  return response.json()
}

export async function buscarInvestidor(id: number): Promise<Investidor> {
  const response = await fetch(`${API_BASE_URL}/investidores/${id}`)
  if (!response.ok) throw new Error('Erro ao buscar investidor')
  return response.json()
}

// ============ CARTEIRAS ============

export async function listarCarteiras(investidorId: number): Promise<Carteira[]> {
  const response = await fetch(`${API_BASE_URL}/carteiras?investidorId=${investidorId}`)
  if (!response.ok) throw new Error('Erro ao listar carteiras')
  return response.json()
}

export async function criarCarteira(data: { nome: string; investidorId: number }): Promise<Carteira> {
  const response = await fetch(`${API_BASE_URL}/carteiras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao criar carteira')
  return response.json()
}

export async function buscarResumoCarteira(carteiraId: number): Promise<CarteiraResumo> {
  const response = await fetch(`${API_BASE_URL}/carteiras/${carteiraId}/resumo`)
  if (!response.ok) throw new Error('Erro ao buscar resumo da carteira')
  return response.json()
}

// ============ ATIVOS ============

export async function listarAtivos(): Promise<AtivoFinanceiro[]> {
  const response = await fetch(`${API_BASE_URL}/ativos`)
  if (!response.ok) throw new Error('Erro ao listar ativos')
  return response.json()
}

export async function criarAtivo(data: { codigo: string }): Promise<AtivoFinanceiro> {
  const response = await fetch(`${API_BASE_URL}/ativos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao criar ativo')
  return response.json()
}

// ============ TRANSAÇÕES ============

export async function listarTransacoes(carteiraId?: number): Promise<Transacao[]> {
  const url = carteiraId 
    ? `${API_BASE_URL}/transacoes?carteiraId=${carteiraId}`
    : `${API_BASE_URL}/transacoes`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Erro ao listar transações')
  return response.json()
}

export async function criarTransacao(data: {
  carteiraId: number
  ativoFinanceiroId: number
  quantidade: number
  precoOperacao: number
  tipoOperacao: 'COMPRA' | 'VENDA'
}): Promise<Transacao> {
  const response = await fetch(`${API_BASE_URL}/transacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Erro ao criar transação')
  return response.json()
}
