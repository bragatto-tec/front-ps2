// Tipos para o Monitor de Investimentos

export interface Investidor {
  id: number
  nome: string
  email: string
}

export interface Carteira {
  id: number
  nome: string
  investidorId: number
}

export interface CarteiraResumo {
  nomeCarteira: string;
  nomeInvestidor: string;
  valorTotalInvestido: number;
  valorTotalAtual: number;
}

export interface AtivoFinanceiro {
  id: number
  codigo: string
  nome?: string
  tipo?: string
}

export interface Transacao {
  id: number;
  nomeCarteira: string;
  codigoAtivo: string;
  quantidade: number;
  precoOperacao: number;
  tipoOperacao: 'COMPRA' | 'VENDA';
  dataOperacao?: string;
}

export interface AtivoCarteira {
  ativoFinanceiro: AtivoFinanceiro
  quantidade: number
  precoMedio: number
  valorAtual: number
  rentabilidade: number
}
