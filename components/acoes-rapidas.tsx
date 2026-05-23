'use client'

import { useState } from 'react'
import { TrendingUp, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useInvestimentosStore } from '@/lib/store'
import { criarAtivo, criarTransacao, buscarResumoCarteira, listarTransacoes } from '@/lib/api'

export function AcoesRapidas() {
  const {
    carteiraAtiva,
    ativos,
    addAtivo,
    addTransacao,
    setResumoCarteira,
    setTransacoes,
    setError,
  } = useInvestimentosStore()

  const [ativoModalOpen, setAtivoModalOpen] = useState(false)
  const [transacaoModalOpen, setTransacaoModalOpen] = useState(false)
  const [novoAtivo, setNovoAtivo] = useState({ codigo: '' })
  const [novaTransacao, setNovaTransacao] = useState({
    ativoId: '',
    quantidade: '',
    preco: '',
    tipo: 'COMPRA' as 'COMPRA' | 'VENDA',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleCriarAtivo = async () => {
    if (!novoAtivo.codigo) return

    setIsLoading(true)
    setError(null)
    try {
      const ativo = await criarAtivo({ codigo: novoAtivo.codigo.toUpperCase() })
      addAtivo(ativo)
      setAtivoModalOpen(false)
      setNovoAtivo({ codigo: '' })
    } catch (error) {
      console.error('Erro ao criar ativo:', error)
      setError('Erro ao criar ativo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCriarTransacao = async () => {
    if (
      !novaTransacao.ativoId ||
      !novaTransacao.quantidade ||
      !novaTransacao.preco ||
      !carteiraAtiva
    )
      return

    setIsLoading(true)
    setError(null)
    try {
      const transacaoData = {
        carteiraId: carteiraAtiva.id,
        ativoFinanceiroId: parseInt(novaTransacao.ativoId),
        quantidade: parseInt(novaTransacao.quantidade),
        precoOperacao: parseFloat(novaTransacao.preco),
        tipoOperacao: novaTransacao.tipo,
      }

      const transacao = await criarTransacao(transacaoData)
      addTransacao(transacao)

      // Recarregar resumo e transações
      const [resumo, transacoes] = await Promise.all([
        buscarResumoCarteira(carteiraAtiva.id),
        listarTransacoes(carteiraAtiva.id),
      ])
      setResumoCarteira(resumo)
      setTransacoes(transacoes)

      setTransacaoModalOpen(false)
      setNovaTransacao({ ativoId: '', quantidade: '', preco: '', tipo: 'COMPRA' })
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      setError('Erro ao criar transação')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Modal: Novo Ativo */}
      <Dialog open={ativoModalOpen} onOpenChange={setAtivoModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Novo Ativo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Ativo</DialogTitle>
            <DialogDescription>
              Cadastre um novo ativo financeiro para suas operações.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="codigoAtivo">Código do Ativo</Label>
              <Input
                id="codigoAtivo"
                placeholder="Ex: PETR4, VALE3, ITUB4"
                value={novoAtivo.codigo}
                onChange={(e) =>
                  setNovoAtivo({ codigo: e.target.value.toUpperCase() })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAtivoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCriarAtivo} disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Ativo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Nova Transação */}
      <Dialog open={transacaoModalOpen} onOpenChange={setTransacaoModalOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Nova Transação
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Transação</DialogTitle>
            <DialogDescription>
              Registre uma compra ou venda de ativos na carteira{' '}
              <strong>{carteiraAtiva?.nome || 'selecionada'}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tipoOperacao">Tipo de Operação</Label>
              <Select
                value={novaTransacao.tipo}
                onValueChange={(value) =>
                  setNovaTransacao({
                    ...novaTransacao,
                    tipo: value as 'COMPRA' | 'VENDA',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPRA">Compra</SelectItem>
                  <SelectItem value="VENDA">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ativoSelect">Ativo</Label>
              <Select
                value={novaTransacao.ativoId}
                onValueChange={(value) =>
                  setNovaTransacao({ ...novaTransacao, ativoId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ativo" />
                </SelectTrigger>
                <SelectContent>
                  {ativos.length > 0 ? (
                    ativos.map((ativo) => (
                      <SelectItem key={ativo.id} value={ativo.id.toString()}>
                        {ativo.codigo} {ativo.nome && `- ${ativo.nome}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Nenhum ativo cadastrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {ativos.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Cadastre um ativo primeiro usando o botão &quot;Novo Ativo&quot;
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="100"
                  min="1"
                  value={novaTransacao.quantidade}
                  onChange={(e) =>
                    setNovaTransacao({ ...novaTransacao, quantidade: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preco">Preço Unitário (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  placeholder="35.50"
                  step="0.01"
                  min="0.01"
                  value={novaTransacao.preco}
                  onChange={(e) =>
                    setNovaTransacao({ ...novaTransacao, preco: e.target.value })
                  }
                />
              </div>
            </div>

            {novaTransacao.quantidade && novaTransacao.preco && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">Valor Total da Operação</p>
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(
                    parseInt(novaTransacao.quantidade || '0') *
                      parseFloat(novaTransacao.preco || '0')
                  )}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransacaoModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCriarTransacao}
              disabled={isLoading || !carteiraAtiva || ativos.length === 0}
            >
              {isLoading ? 'Registrando...' : 'Registrar Transação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
