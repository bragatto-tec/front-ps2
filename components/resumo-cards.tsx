'use client'

import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Percent } from 'lucide-react'
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

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const isPositive = (resumoCarteira?.rentabilidade ?? 0) >= 0

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
            {formatCurrency(resumoCarteira?.valorInvestido ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground">Total aplicado na carteira</p>
        </CardContent>
      </Card>

      {/* Saldo Atual */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(resumoCarteira?.saldoAtual ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground">Valor de mercado atual</p>
        </CardContent>
      </Card>

      {/* Rentabilidade R$ */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}
            {formatCurrency(resumoCarteira?.rentabilidade ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground">Lucro/Prejuízo total</p>
        </CardContent>
      </Card>

      {/* Rentabilidade % */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rentabilidade %</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}
            {(resumoCarteira?.rentabilidadePercentual ?? 0).toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">Percentual de retorno</p>
        </CardContent>
      </Card>
    </div>
  )
}
