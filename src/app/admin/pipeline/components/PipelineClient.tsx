"use client";

import PipelineFunnel from "@/components/admin/PipelineFunnel";
import PipelineStatusBreakdown from "@/components/admin/PipelineStatusBreakdown";
import { Badge } from "@/components/ui/badge";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
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
import { moneyMask } from "@/utils/functions";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 20;

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
	const [page, setPage] = useState(1);
	const { result, isLoading } = useFetchPipeline(page, PAGE_SIZE);

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
				{list.items.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						Nenhuma operação encontrada.
					</p>
				) : (
					<>
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
								{list.items.map((row) => (
									<TableRow key={row.id}>
										<TableCell>{row.orderNumber ?? row.id}</TableCell>
										<TableCell>{row.produto}</TableCell>
										<TableCell>{row.vendedor}</TableCell>
										<TableCell>{moneyMask(row.valor)}</TableCell>
										<TableCell>
											<Badge variant="outline">{row.status}</Badge>
										</TableCell>
										<TableCell>{row.diasEtapa} dia(s)</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
							<p className="text-xs text-muted-foreground">
								Página {list.page} de {list.totalPages} — {list.total} registro(s)
							</p>
							<Pagination className="mx-0 w-auto">
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											href="#"
											aria-disabled={list.page <= 1}
											className={list.page <= 1 ? "pointer-events-none opacity-50" : ""}
											onClick={(e) => {
												e.preventDefault();
												setPage((p) => Math.max(1, p - 1));
											}}
										/>
									</PaginationItem>
									<PaginationItem>
										<PaginationNext
											href="#"
											aria-disabled={list.page >= list.totalPages}
											className={
												list.page >= list.totalPages ? "pointer-events-none opacity-50" : ""
											}
											onClick={(e) => {
												e.preventDefault();
												setPage((p) => Math.min(list.totalPages, p + 1));
											}}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
