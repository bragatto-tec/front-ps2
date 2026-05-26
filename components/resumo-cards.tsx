"use client";

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestimentosStore } from "@/lib/store";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ResumoCards() {
  const { resumoCarteira, carteiraAtiva } = useInvestimentosStore();
  if (!carteiraAtiva || !resumoCarteira) return null;

  const valorInvestido = resumoCarteira.valorTotalInvestido;
  const valorAtual = resumoCarteira.valorTotalAtual;
  const lucro = valorAtual - valorInvestido; // AQUI ESTÁ O SEU LUCRO!
  const isLucro = lucro >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Valor Investido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(valorInvestido)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Valor de Mercado (API)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(valorAtual)}</div>
        </CardContent>
      </Card>

      {/* ESTE É O CARD DA PROVA REAL */}
      <Card className={isLucro ? "border-emerald-500" : "border-red-500"}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Lucro / Prejuízo</CardTitle>
          {isLucro ? (
            <TrendingUp className="text-emerald-500" />
          ) : (
            <TrendingDown className="text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${isLucro ? "text-emerald-500" : "text-red-500"}`}
          >
            {formatCurrency(lucro)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
