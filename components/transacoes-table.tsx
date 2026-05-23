'use client'

import { useState } from 'react'
import { ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useInvestimentosStore } from '@/lib/store'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TransacoesTable() {
  const { transacoes, carteiraAtiva, isLoading } = useInvestimentosStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState<'TODOS' | 'COMPRA' | 'VENDA'>('TODOS')

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter((transacao) => {
    const matchSearch =
      transacao.ativoFinanceiro?.codigo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ?? false
    const matchTipo = filterTipo === 'TODOS' || transacao.tipoOperacao === filterTipo
    return matchSearch && matchTipo
  })

  if (!carteiraAtiva) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              Todas as operações realizadas na carteira
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ativo..."
                className="pl-8 w-[180px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filterTipo}
              onValueChange={(value) =>
                setFilterTipo(value as 'TODOS' | 'COMPRA' | 'VENDA')
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filtrar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="COMPRA">Compra</SelectItem>
                <SelectItem value="VENDA">Venda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Preço Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : transacoesFiltradas.length > 0 ? (
                transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>
                      {transacao.tipoOperacao === 'COMPRA' ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500 text-emerald-500"
                        >
                          <ArrowUpCircle className="mr-1 h-3 w-3" />
                          Compra
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-500 text-red-500"
                        >
                          <ArrowDownCircle className="mr-1 h-3 w-3" />
                          Venda
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transacao.ativoFinanceiro?.codigo || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {transacao.quantidade}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transacao.precoOperacao)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transacao.quantidade * transacao.precoOperacao)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(transacao.dataOperacao)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
