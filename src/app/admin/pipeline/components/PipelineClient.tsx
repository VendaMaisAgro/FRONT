"use client";

import DateRangeFilter from "@/components/admin/DateRangeFilter";
import PipelineFunnel from "@/components/admin/PipelineFunnel";
import PipelineStatusBreakdown from "@/components/admin/PipelineStatusBreakdown";
import StatusMultiSelect, { StatusOption } from "@/components/admin/StatusMultiSelect";
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
import {
	DatePreset,
	computePresetRange,
	endOfDayISO,
	startOfDayISO,
} from "@/lib/dateRangePresets";
import { PipelineStageCount } from "@/types/types";
import { moneyMask } from "@/utils/functions";
import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 20;

function errorMessage(status: number) {
	if (status === 403) {
		return "Você não tem permissão de administrador para ver esses dados.";
	}
	if (status === 401) {
		return "Sua sessão expirou. Faça login novamente.";
	}
	if (status === 400) {
		return "Filtro inválido. Verifique as datas e os status selecionados.";
	}
	return "Não foi possível carregar o Pipeline das Operações agora. Tente novamente mais tarde.";
}

function buildStatusOptions(
	statusCounts: PipelineStageCount[],
	terminal: PipelineStageCount[]
): StatusOption[] {
	const stageOptions = [...statusCounts]
		.sort((a, b) => a.stage - b.stage)
		.map((s) => ({ stage: s.stage, label: s.label, count: s.count }));

	const terminalCount = terminal.reduce((sum, t) => sum + t.count, 0);
	const terminalLabel =
		terminal.map((t) => t.label).join(" / ") || "Cancelado / Recusado pelo vendedor";

	return [{ stage: 0, label: terminalLabel, count: terminalCount }, ...stageOptions];
}

export default function PipelineClient() {
	const [preset, setPreset] = useState<DatePreset | null>(null);
	const [customStart, setCustomStart] = useState("");
	const [customEnd, setCustomEnd] = useState("");
	const [selectedStages, setSelectedStages] = useState<number[]>([]);
	const [page, setPage] = useState(1);

	const dateRange = useMemo(() => {
		if (preset) return computePresetRange(preset);
		return {
			startDate: customStart ? startOfDayISO(customStart) : undefined,
			endDate: customEnd ? endOfDayISO(customEnd) : undefined,
		};
	}, [preset, customStart, customEnd]);

	const { result, isLoading } = useFetchPipeline({
		page,
		pageSize: PAGE_SIZE,
		startDate: dateRange.startDate,
		endDate: dateRange.endDate,
		stage: selectedStages,
	});

	function handlePresetSelect(next: DatePreset) {
		setPreset((current) => (current === next ? null : next));
		setCustomStart("");
		setCustomEnd("");
		setPage(1);
	}

	function handleCustomChange(field: "start" | "end", value: string) {
		setPreset(null);
		if (field === "start") setCustomStart(value);
		else setCustomEnd(value);
		setPage(1);
	}

	function handleClearDate() {
		setPreset(null);
		setCustomStart("");
		setCustomEnd("");
		setPage(1);
	}

	function handleStagesChange(stages: number[]) {
		setSelectedStages(stages);
		setPage(1);
	}

	const statusOptions =
		result && result.ok
			? buildStatusOptions(result.data.statusCounts, result.data.terminal)
			: [];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
				<DateRangeFilter
					preset={preset}
					customStart={customStart}
					customEnd={customEnd}
					onPresetSelect={handlePresetSelect}
					onCustomChange={handleCustomChange}
					onClear={handleClearDate}
				/>
				<StatusMultiSelect
					options={statusOptions}
					selected={selectedStages}
					onChange={handleStagesChange}
				/>
			</div>

			{isLoading ? (
				<div className="space-y-6">
					<Skeleton className="h-64 w-full" />
					<Skeleton className="h-56 w-full" />
					<Skeleton className="h-80 w-full" />
				</div>
			) : !result || !result.ok ? (
				<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white p-10 text-center">
					<AlertTriangle className="text-attention" size={28} />
					<p className="text-sm text-foreground/80">
						{errorMessage(result?.status ?? 500)}
					</p>
				</div>
			) : (
				<>
					<PipelineFunnel data={result.data.funnel} />
					<PipelineStatusBreakdown
						statusCounts={result.data.statusCounts}
						terminal={result.data.terminal}
					/>

					<div className="rounded-xl border border-border bg-white p-4">
						<h3 className="mb-4 text-sm font-semibold text-foreground">
							Operações em andamento
						</h3>
						{result.data.list.items.length === 0 ? (
							<p className="py-6 text-center text-sm text-muted-foreground">
								Nenhuma operação encontrada para os filtros selecionados.
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
										{result.data.list.items.map((row) => (
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
										Página {result.data.list.page} de {result.data.list.totalPages} —{" "}
										{result.data.list.total} registro(s)
									</p>
									<Pagination className="mx-0 w-auto">
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													href="#"
													aria-disabled={result.data.list.page <= 1}
													className={
														result.data.list.page <= 1
															? "pointer-events-none opacity-50"
															: ""
													}
													onClick={(e) => {
														e.preventDefault();
														setPage((p) => Math.max(1, p - 1));
													}}
												/>
											</PaginationItem>
											<PaginationItem>
												<PaginationNext
													href="#"
													aria-disabled={result.data.list.page >= result.data.list.totalPages}
													className={
														result.data.list.page >= result.data.list.totalPages
															? "pointer-events-none opacity-50"
															: ""
													}
													onClick={(e) => {
														e.preventDefault();
														setPage((p) => Math.min(result.data.list.totalPages, p + 1));
													}}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
}
