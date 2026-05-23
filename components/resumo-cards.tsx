'use client'

import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useInvestimentosStore } from '@/lib/store'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function ResumoCards() {
  const { resumoCarteira, carteiraAtiva, isLoading } = useInvestimentosStore()

  if (!carteiraAtiva) {
    return null
  }

  // Mostra apenas 1 skeleton loader enquanto carrega
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pegamos apenas o Valor Investido do DTO do Java
  const valorInvestido = resumoCarteira?.valorTotalInvestido ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Valor Investido */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Investido</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(valorInvestido)}
          </div>
          <p className="text-xs text-muted-foreground">Total aplicado na carteira</p>
        </CardContent>
      </Card>
    </div>
  )
}