"use client";

import AlertsCountCards from "@/components/admin/AlertsCountCards";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import useFetchAlerts from "@/hooks/useFetchAlerts";
import { AlertTriangle } from "lucide-react";

function errorMessage(status: number) {
	if (status === 403) {
		return "Você não tem permissão de administrador para ver esses dados.";
	}
	if (status === 401) {
		return "Sua sessão expirou. Faça login novamente.";
	}
	return "Não foi possível carregar os Alertas Operacionais agora. Tente novamente mais tarde.";
}

export default function AlertsClient() {
	const { result, isLoading } = useFetchAlerts();

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-24 w-full" />
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

	const { counts, list } = result.data;

	return (
		<div className="space-y-6">
			<AlertsCountCards counts={counts} />

			<div className="rounded-xl border border-border bg-white p-4">
				<h3 className="mb-1 text-sm font-semibold text-foreground">
					Lista de Alertas
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Exibindo {list.items.length} de {list.total} alerta(s)
				</p>
				{list.items.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						Nenhum alerta no momento.
					</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Pedido</TableHead>
								<TableHead>Problema</TableHead>
								<TableHead>Responsável</TableHead>
								<TableHead>Ação</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{list.items.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.orderNumber ?? item.id}</TableCell>
									<TableCell>{item.problema}</TableCell>
									<TableCell>{item.responsavel}</TableCell>
									<TableCell>{item.acao}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
