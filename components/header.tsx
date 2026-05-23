'use client'

import { useState } from 'react'
import { Wallet, User, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useInvestimentosStore } from '@/lib/store'
import { criarInvestidor, criarCarteira, listarCarteiras } from '@/lib/api'

export function Header() {
  const {
    investidorAtivo,
    setInvestidorAtivo,
    carteiras,
    setCarteiras,
    addCarteira,
    carteiraAtiva,
    setCarteiraAtiva,
    setError,
  } = useInvestimentosStore()

  const [investidorModalOpen, setInvestidorModalOpen] = useState(false)
  const [carteiraModalOpen, setCarteiraModalOpen] = useState(false)
  const [novoInvestidor, setNovoInvestidor] = useState({ nome: '', email: '' })
  const [novaCarteira, setNovaCarteira] = useState({ nome: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleCriarInvestidor = async () => {
    if (!novoInvestidor.nome || !novoInvestidor.email) return

    setIsLoading(true)
    setError(null)
    try {
      const investidor = await criarInvestidor(novoInvestidor)
      setInvestidorAtivo(investidor)
      const novasCarteiras = await listarCarteiras(investidor.id)
      setCarteiras(novasCarteiras)
      setCarteiraAtiva(novasCarteiras[0] || null)
      setInvestidorModalOpen(false)
      setNovoInvestidor({ nome: '', email: '' })
    } catch (error) {
      console.error('Erro ao criar investidor:', error)
      setError('Erro ao criar investidor. Verifique se o backend está rodando.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCriarCarteira = async () => {
    if (!novaCarteira.nome || !investidorAtivo) return

    setIsLoading(true)
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
    } catch (error) {
      console.error('Erro ao criar carteira:', error)
      setError('Erro ao criar carteira. Verifique se o backend está rodando.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Monitor de Investimentos</h1>
            <p className="text-xs text-muted-foreground">
              {investidorAtivo?.nome || 'Nenhum investidor'}
            </p>
          </div>
        </div>

        {/* Seletor de Carteiras (Destaque Principal) */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-between">
                <span className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  {carteiraAtiva?.nome || 'Selecione uma Carteira'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[220px]">
              {carteiras.length > 0 ? (
                <>
                  {carteiras.map((carteira) => (
                    <DropdownMenuItem
                      key={carteira.id}
                      onClick={() => setCarteiraAtiva(carteira)}
                      className={carteiraAtiva?.id === carteira.id ? 'bg-accent' : ''}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {carteira.nome}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              ) : null}
              <DropdownMenuItem onClick={() => setCarteiraModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Carteira
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ações do Investidor */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInvestidorModalOpen(true)}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            Trocar/Criar Investidor
          </Button>
        </div>
      </div>

      {/* Modal: Criar/Trocar Investidor */}
      <Dialog open={investidorModalOpen} onOpenChange={setInvestidorModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trocar ou Criar Investidor</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo perfil de investidor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={novoInvestidor.nome}
                onChange={(e) =>
                  setNovoInvestidor({ ...novoInvestidor, nome: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={novoInvestidor.email}
                onChange={(e) =>
                  setNovoInvestidor({ ...novoInvestidor, email: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvestidorModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCriarInvestidor} disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Investidor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Criar Carteira */}
      <Dialog open={carteiraModalOpen} onOpenChange={setCarteiraModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Carteira</DialogTitle>
            <DialogDescription>
              Crie uma nova carteira para organizar seus investimentos.
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
            <Button onClick={handleCriarCarteira} disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Carteira'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
