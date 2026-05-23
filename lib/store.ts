// Store Zustand para gerenciamento de estado global
import { create } from 'zustand'
import type { Investidor, Carteira, CarteiraResumo, Transacao, AtivoFinanceiro } from './types'

interface InvestimentosState {
  // Investidor ativo (padrão ID 1)
  investidorAtivo: Investidor | null
  setInvestidorAtivo: (investidor: Investidor | null) => void

  // Carteiras do investidor
  carteiras: Carteira[]
  setCarteiras: (carteiras: Carteira[]) => void
  addCarteira: (carteira: Carteira) => void

  // Carteira selecionada
  carteiraAtiva: Carteira | null
  setCarteiraAtiva: (carteira: Carteira | null) => void

  // Resumo da carteira ativa
  resumoCarteira: CarteiraResumo | null
  setResumoCarteira: (resumo: CarteiraResumo | null) => void

  // Transações
  transacoes: Transacao[]
  setTransacoes: (transacoes: Transacao[]) => void
  addTransacao: (transacao: Transacao) => void

  // Ativos disponíveis
  ativos: AtivoFinanceiro[]
  setAtivos: (ativos: AtivoFinanceiro[]) => void
  addAtivo: (ativo: AtivoFinanceiro) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Error state
  error: string | null
  setError: (error: string | null) => void
}

export const useInvestimentosStore = create<InvestimentosState>((set) => ({
  // Investidor ativo padrão
  investidorAtivo: { id: 1, nome: 'Investidor Padrão', email: 'investidor@email.com' },
  setInvestidorAtivo: (investidor) => set({ investidorAtivo: investidor }),

  // Carteiras
  carteiras: [],
  setCarteiras: (carteiras) => set({ carteiras }),
  addCarteira: (carteira) => set((state) => ({ carteiras: [...state.carteiras, carteira] })),

  // Carteira ativa
  carteiraAtiva: null,
  setCarteiraAtiva: (carteira) => set({ carteiraAtiva: carteira }),

  // Resumo
  resumoCarteira: null,
  setResumoCarteira: (resumo) => set({ resumoCarteira: resumo }),

  // Transações
  transacoes: [],
  setTransacoes: (transacoes) => set({ transacoes }),
  addTransacao: (transacao) => set((state) => ({ transacoes: [...state.transacoes, transacao] })),

  // Ativos
  ativos: [],
  setAtivos: (ativos) => set({ ativos }),
  addAtivo: (ativo) => set((state) => ({ ativos: [...state.ativos, ativo] })),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Error
  error: null,
  setError: (error) => set({ error }),
}))
