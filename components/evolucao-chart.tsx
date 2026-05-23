'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useInvestimentosStore } from '@/lib/store'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
  }).format(value)
}

export function EvolucaoChart() {
  const { resumoCarteira, carteiraAtiva } = useInvestimentosStore()

  if (!carteiraAtiva) {
    return null
  }

  // Dados baseados no resumo da carteira
  const data = resumoCarteira ? [
    {
      nome: carteiraAtiva.nome,
      investido: resumoCarteira.valorInvestido,
      atual: resumoCarteira.saldoAtual,
    }
  ] : []

  if (data.length === 0 || !resumoCarteira?.valorInvestido) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Evolução Patrimonial</CardTitle>
          <CardDescription>Comparativo entre valor investido e saldo atual</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground text-center">
            Nenhum dado disponível.
            <br />
            Adicione transações para ver a evolução.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Evolução Patrimonial</CardTitle>
        <CardDescription>Comparativo entre valor investido e saldo atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="nome"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={formatCurrency}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'investido' ? 'Investido' : 'Saldo Atual',
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend
                formatter={(value) =>
                  value === 'investido' ? 'Valor Investido' : 'Saldo Atual'
                }
              />
              <Bar
                dataKey="investido"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
                name="investido"
              />
              <Bar
                dataKey="atual"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
                name="atual"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
