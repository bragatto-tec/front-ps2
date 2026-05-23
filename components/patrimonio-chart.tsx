'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useInvestimentosStore } from '@/lib/store'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function PatrimonioChart() {
  const { transacoes, carteiraAtiva } = useInvestimentosStore()

  if (!carteiraAtiva) {
    return null
  }

  // Agrupar transações por ativo para calcular posição
  const posicoesPorAtivo = transacoes.reduce((acc, transacao) => {
    // CORREÇÃO: Lendo o nome exato do DTO do Java
    const codigo = transacao.codigoAtivo || 'N/A'
    if (!acc[codigo]) {
      acc[codigo] = { quantidade: 0, valorTotal: 0 }
    }
    
    const multiplicador = transacao.tipoOperacao === 'COMPRA' ? 1 : -1
    acc[codigo].quantidade += transacao.quantidade * multiplicador
    acc[codigo].valorTotal += transacao.quantidade * transacao.precoOperacao * multiplicador
    
    return acc
  }, {} as Record<string, { quantidade: number; valorTotal: number }>)

  // Converter para formato do gráfico
  const data = Object.entries(posicoesPorAtivo)
    .filter(([_, posicao]) => posicao.quantidade > 0)
    .map(([codigo, posicao]) => ({
      name: codigo,
      value: posicao.valorTotal,
    }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribuição do Patrimônio</CardTitle>
          <CardDescription>Composição da carteira por ativo</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground text-center">
            Nenhum ativo na carteira.
            <br />
            Adicione transações para ver a distribuição.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição do Patrimônio</CardTitle>
        <CardDescription>Composição da carteira por ativo</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-2xl font-bold">{formatCurrency(total)}</p>
        </div>
      </CardContent>
    </Card>
  )
}