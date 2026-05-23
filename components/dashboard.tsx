'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { ResumoCards } from '@/components/resumo-cards'
import { PatrimonioChart } from '@/components/patrimonio-chart'
import { EvolucaoChart } from '@/components/evolucao-chart'
import { TransacoesTable } from '@/components/transacoes-table'
import { AcoesRapidas } from '@/components/acoes-rapidas'
import { EmptyState } from '@/components/empty-state'
import { useInvestimentosStore } from '@/lib/store'
import { criarCarteira, listarCarteiras, buscarResumoCarteira, listarTransacoes, listarAtivos } from '@/lib/api'

export function Dashboard() {
  const {
    investidorAtivo,
    carteiras,
    setCarteiras,
    addCarteira,
    carteiraAtiva,
    setCarteiraAtiva,
    setResumoCarteira,
    setTransacoes,
    setAtivos,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useInvestimentosStore()

  const [carteiraModalOpen, setCarteiraModalOpen] = useState(false)
  const [novaCarteira, setNovaCarteira] = useState({ nome: '' })
  const [isCreating, setIsCreating] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  // Carregar dados iniciais
  useEffect(() => {
    async function carregarDados() {
      if (!investidorAtivo) return

      setIsLoading(true)
      setError(null)

      try {
        // Carregar carteiras do investidor
        const carteirasData = await listarCarteiras(investidorAtivo.id)
        setCarteiras(carteirasData)

        // Selecionar primeira carteira se existir
        if (carteirasData.length > 0 && !carteiraAtiva) {
          setCarteiraAtiva(carteirasData[0])
        }

        // Carregar ativos disponíveis
        const ativosData = await listarAtivos()
        setAtivos(ativosData)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Erro ao conectar com o backend. Verifique se está rodando em localhost:8080')
      } finally {
        setIsLoading(false)
        setInitialLoad(false)
      }
    }

    carregarDados()
  }, [investidorAtivo])

  // Carregar dados da carteira ativa
  useEffect(() => {
    async function carregarDadosCarteira() {
      if (!carteiraAtiva) {
        setResumoCarteira(null)
        setTransacoes([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Carregar resumo e transações da carteira
        const [resumo, transacoes] = await Promise.all([
          buscarResumoCarteira(carteiraAtiva.id),
          listarTransacoes(carteiraAtiva.id),
        ])

        setResumoCarteira(resumo)
        setTransacoes(transacoes)
      } catch (err) {
        console.error('Erro ao carregar dados da carteira:', err)
        setError('Erro ao carregar dados da carteira')
      } finally {
        setIsLoading(false)
      }
    }

    carregarDadosCarteira()
  }, [carteiraAtiva])

  const handleCriarCarteira = async () => {
    if (!novaCarteira.nome || !investidorAtivo) return

    setIsCreating(true)
    setError(null)
    try {
      const carteira = await criarCarteira({
        nome: novaCarteira.nome,
        investidorId: investidorAtivo.id,
      })
      addCarteira(carteira)
      setCarteiraAtiva(carteira)
      setCarteiraModalOpen(false)
      setNovaCarteira({ nome: '' })
    } catch (err) {
      console.error('Erro ao criar carteira:', err)
      setError('Erro ao criar carteira')
    } finally {
      setIsCreating(false)
    }
  }

  // Loading inicial
  if (initialLoad && isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Conectando ao backend...</p>
        </div>
      </div>
    )
  }

  // Erro de conexão
  if (error && carteiras.length === 0) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            <span className="text-sm">
              Certifique-se de que seu backend Spring Boot está rodando em{' '}
              <code className="rounded bg-destructive-foreground/10 px-1">localhost:8080</code>
            </span>
          </AlertDescription>
        </Alert>
        <EmptyState onCreateCarteira={() => setCarteiraModalOpen(true)} />
      </div>
    )
  }

  // Estado vazio - sem carteiras
  if (carteiras.length === 0) {
    return (
      <>
        <EmptyState onCreateCarteira={() => setCarteiraModalOpen(true)} />

        {/* Modal: Criar Carteira */}
        <Dialog open={carteiraModalOpen} onOpenChange={setCarteiraModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Primeira Carteira</DialogTitle>
              <DialogDescription>
                Dê um nome para sua carteira de investimentos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nomeCarteira">Nome da Carteira</Label>
                <Input
                  id="nomeCarteira"
                  placeholder="Ex: Carteira de Ações"
                  value={novaCarteira.nome}
                  onChange={(e) => setNovaCarteira({ nome: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCarteiraModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCriarCarteira} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Carteira'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alert de erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Barra de Ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            {carteiraAtiva
              ? `Visualizando: ${carteiraAtiva.nome}`
              : 'Selecione uma carteira para começar'}
          </p>
        </div>
        <AcoesRapidas />
      </div>

      {/* Cards de Resumo */}
      <ResumoCards />

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PatrimonioChart />
        <EvolucaoChart />
      </div>

      {/* Tabela de Transações */}
      <TransacoesTable />
    </div>
  )
}
