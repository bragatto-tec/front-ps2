'use client'

import { Wallet, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EmptyStateProps {
  onCreateCarteira: () => void
}

export function EmptyState({ onCreateCarteira }: EmptyStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao Monitor!</CardTitle>
          <CardDescription className="text-base">
            Você ainda não tem nenhuma carteira criada. Crie sua primeira carteira
            para começar a acompanhar seus investimentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCreateCarteira} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Criar Minha Primeira Carteira
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
