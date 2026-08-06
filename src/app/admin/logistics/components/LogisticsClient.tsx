"use client";

import LogisticsPerformanceList from "@/components/admin/LogisticsPerformanceList";
import { KpiCard } from "@/components/admin/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchLogistics from "@/hooks/useFetchLogistics";
import { AlertTriangle, Clock, Percent, Truck } from "lucide-react";

function errorMessage(status: number) {
	if (status === 403) {
		return "Você não tem permissão de administrador para ver esses dados.";
	}
	if (status === 401) {
		return "Sua sessão expirou. Faça login novamente.";
	}
	return "Não foi possível carregar a Logística e Desempenho agora. Tente novamente mais tarde.";
}

function formatDays(value: number | null) {
	return value === null ? "Sem dados" : `${value.toFixed(1)} dias`;
}

function formatPercent(value: number | null) {
	return value === null ? "Sem dados" : `${value.toFixed(0)}%`;
}

export default function LogisticsClient() {
	const { result, isLoading } = useFetchLogistics();

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{[0, 1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-24 w-full" />
					))}
				</div>
				<Skeleton className="h-64 w-full" />
				<Skeleton className="h-64 w-full" />
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

	const {
		deliveredCount,
		averageDeliveryDays,
		onTimePercent,
		averageDelayDays,
		byBuyer,
		bySeller,
	} = result.data;

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<KpiCard
					title="Entregas realizadas"
					value={deliveredCount.toLocaleString("pt-BR")}
					icon={Truck}
				/>
				<KpiCard
					title="Tempo médio de entrega"
					value={formatDays(averageDeliveryDays)}
					icon={Clock}
					tone="neutral"
				/>
				<KpiCard
					title="% no prazo"
					value={formatPercent(onTimePercent)}
					icon={Percent}
					tone="neutral"
				/>
				<KpiCard
					title="Atraso médio"
					value={formatDays(averageDelayDays)}
					icon={AlertTriangle}
					tone="neutral"
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<LogisticsPerformanceList title="Desempenho por Comprador" rows={byBuyer} />
				<LogisticsPerformanceList title="Desempenho por Vendedor" rows={bySeller} />
			</div>
		</div>
	);
}
