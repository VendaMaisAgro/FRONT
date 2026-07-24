"use client";

import PipelineFunnel from "@/components/admin/PipelineFunnel";
import PipelineStatusBreakdown from "@/components/admin/PipelineStatusBreakdown";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import useFetchPipeline from "@/hooks/useFetchPipeline";
import { ORDER_STATUS_BADGE_CLASS, ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import { moneyMask } from "@/utils/functions";
import { AlertTriangle } from "lucide-react";

function errorMessage(status: number) {
	if (status === 403) {
		return "Você não tem permissão de administrador para ver esses dados.";
	}
	if (status === 401) {
		return "Sua sessão expirou. Faça login novamente.";
	}
	return "Não foi possível carregar o Pipeline das Operações agora. Tente novamente mais tarde.";
}

export default function PipelineClient() {
	const { result, isLoading } = useFetchPipeline();

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-64 w-full" />
				<Skeleton className="h-56 w-full" />
				<Skeleton className="h-80 w-full" />
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

	const { funnel, statusCounts, terminal, list } = result.data;

	return (
		<div className="space-y-6">
			<PipelineFunnel data={funnel} />
			<PipelineStatusBreakdown statusCounts={statusCounts} terminal={terminal} />

			<div className="rounded-xl border border-border bg-white p-4">
				<h3 className="mb-4 text-sm font-semibold text-foreground">
					Operações em andamento
				</h3>
				{list.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						Nenhuma operação encontrada.
					</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Pedido</TableHead>
								<TableHead>Produto</TableHead>
								<TableHead>Vendedor</TableHead>
								<TableHead>Valor</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Dias na etapa</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{list.map((row) => (
								<TableRow key={row.id}>
									<TableCell>{row.orderNumber ?? row.id}</TableCell>
									<TableCell>{row.product}</TableCell>
									<TableCell>{row.seller}</TableCell>
									<TableCell>{moneyMask(row.value)}</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className={ORDER_STATUS_BADGE_CLASS[row.status]}
										>
											{ORDER_STATUS_LABELS[row.status]}
										</Badge>
									</TableCell>
									<TableCell>{row.daysInStage} dia(s)</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
