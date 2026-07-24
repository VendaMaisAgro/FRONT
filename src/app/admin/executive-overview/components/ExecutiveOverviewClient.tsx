"use client";

import ForecastBarChart from "@/components/admin/ForecastBarChart";
import { KpiCard } from "@/components/admin/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchExecutiveOverview from "@/hooks/useFetchExecutiveOverview";
import { AlertTriangle, HandCoins, ShoppingBag, Wallet } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatCount = (value: number) => value.toLocaleString("pt-BR");

function errorMessage(status: number) {
	if (status === 403) {
		return "Você não tem permissão de administrador para ver esses dados.";
	}
	if (status === 401) {
		return "Sua sessão expirou. Faça login novamente.";
	}
	return "Não foi possível carregar a Visão Executiva agora. Tente novamente mais tarde.";
}

export default function ExecutiveOverviewClient() {
	const { result, isLoading } = useFetchExecutiveOverview();

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{[0, 1, 2].map((i) => (
						<Skeleton key={i} className="h-24 w-full" />
					))}
				</div>
				<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
					{[0, 1, 2].map((i) => (
						<Skeleton key={i} className="h-72 w-full" />
					))}
				</div>
			</div>
		);
	}

	if (!result || !result.ok) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white p-10 text-center">
				<AlertTriangle className="text-attention" size={28} />
				<p className="text-sm text-foreground/80">
					{errorMessage(result?.status ?? 500)}
				</p>
			</div>
		);
	}

	const { faturamento, receita, operacoes } = result.data;
	const operacoesRealizadoTotal = operacoes.monthly.reduce((sum, m) => sum + m.realizado, 0);
	const operacoesPrevistoTotal = operacoes.monthly.reduce((sum, m) => sum + m.previsto, 0);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<KpiCard
					title="Faturamento (12 meses)"
					value={formatCurrency(faturamento.accumulated.realizado)}
					subValue={`Previsto: ${formatCurrency(faturamento.accumulated.previsto)}`}
					icon={Wallet}
				/>
				<KpiCard
					title="Receita (12 meses)"
					value={formatCurrency(receita.accumulated.realizado)}
					subValue={`Previsto: ${formatCurrency(receita.accumulated.previsto)}`}
					icon={HandCoins}
				/>
				<KpiCard
					title="Operações (12 meses)"
					value={formatCount(operacoesRealizadoTotal)}
					subValue={`Previsto: ${formatCount(operacoesPrevistoTotal)}`}
					icon={ShoppingBag}
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
				<ForecastBarChart
					title="Faturamento — Previsto x Realizado"
					data={faturamento.monthly}
					valueFormatter={formatCurrency}
				/>
				<ForecastBarChart
					title="Receita — Previsto x Realizado"
					data={receita.monthly}
					valueFormatter={formatCurrency}
				/>
				<ForecastBarChart
					title="Operações — Previsto x Realizado"
					data={operacoes.monthly}
					valueFormatter={formatCount}
				/>
			</div>
		</div>
	);
}
