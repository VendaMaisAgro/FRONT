import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import { OrderStatus, PipelineStatusCounts, PipelineTerminal } from "@/types/types";

const STATUS_ORDER = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

type PipelineStatusBreakdownProps = {
	statusCounts: PipelineStatusCounts;
	terminal: PipelineTerminal;
};

export default function PipelineStatusBreakdown({
	statusCounts,
	terminal,
}: PipelineStatusBreakdownProps) {
	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-4 text-sm font-semibold text-foreground">
				Status das Operações
			</h3>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{STATUS_ORDER.map((status) => (
					<div key={status} className="rounded-lg bg-muted/40 p-3">
						<div className="text-xs text-muted-foreground">
							{ORDER_STATUS_LABELS[status]}
						</div>
						<div className="mt-1 text-xl font-semibold text-foreground">
							{(statusCounts[status] ?? 0).toLocaleString("pt-BR")}
						</div>
					</div>
				))}
			</div>
			<div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
				<div className="rounded-lg bg-destructive/10 px-3 py-2">
					<span className="text-xs text-destructive">Cancelado: </span>
					<span className="text-sm font-semibold text-destructive">
						{terminal.cancelled.toLocaleString("pt-BR")}
					</span>
				</div>
				<div className="rounded-lg bg-destructive/10 px-3 py-2">
					<span className="text-xs text-destructive">Recusado: </span>
					<span className="text-sm font-semibold text-destructive">
						{terminal.rejected.toLocaleString("pt-BR")}
					</span>
				</div>
			</div>
		</div>
	);
}
