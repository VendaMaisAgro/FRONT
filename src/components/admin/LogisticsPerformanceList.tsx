import { LogisticsPerformanceRow } from "@/types/types";
import { AlertTriangle } from "lucide-react";

type LogisticsPerformanceListProps = {
	title: string;
	rows: LogisticsPerformanceRow[];
};

export default function LogisticsPerformanceList({
	title,
	rows,
}: LogisticsPerformanceListProps) {
	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
			{rows.length === 0 ? (
				<p className="py-4 text-center text-sm text-muted-foreground">
					Sem dados.
				</p>
			) : (
				<ul className="divide-y divide-border">
					{rows.map((row) => (
						<li
							key={row.id}
							className="flex items-center justify-between gap-3 py-2.5"
						>
							<div className="flex items-center gap-2">
								{row.alerta && (
									<AlertTriangle size={16} className="shrink-0 text-destructive" />
								)}
								<span className="text-sm text-foreground">{row.name}</span>
							</div>
							<div className="flex items-center gap-4 text-sm text-muted-foreground">
								<span>{row.delivered} entrega(s)</span>
								<span
									className={
										row.alerta
											? "font-semibold text-destructive"
											: "font-semibold text-foreground"
									}
								>
									{row.onTimePercent.toFixed(0)}% no prazo
								</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
