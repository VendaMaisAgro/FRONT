import { PipelineStageCount } from "@/types/types";

type PipelineStatusBreakdownProps = {
	statusCounts: PipelineStageCount[];
	terminal: PipelineStageCount[];
};

export default function PipelineStatusBreakdown({
	statusCounts,
	terminal,
}: PipelineStatusBreakdownProps) {
	const orderedStatusCounts = [...statusCounts].sort((a, b) => a.stage - b.stage);

	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-4 text-sm font-semibold text-foreground">
				Status das Operações
			</h3>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{orderedStatusCounts.map((item) => (
					<div key={item.key} className="rounded-lg bg-muted/40 p-3">
						<div className="text-xs text-muted-foreground">{item.label}</div>
						<div className="mt-1 text-xl font-semibold text-foreground">
							{item.count.toLocaleString("pt-BR")}
						</div>
					</div>
				))}
			</div>
			<div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
				{terminal.map((item) => (
					<div key={item.key} className="rounded-lg bg-destructive/10 px-3 py-2">
						<span className="text-xs text-destructive">{item.label}: </span>
						<span className="text-sm font-semibold text-destructive">
							{item.count.toLocaleString("pt-BR")}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
