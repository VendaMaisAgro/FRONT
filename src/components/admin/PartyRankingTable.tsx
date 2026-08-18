import { PartyRanking } from "@/types/types";

// Barra de magnitude (não é identidade categórica) — usa o verde primário já validado
// nos outros gráficos da página (ForecastBarChart/PipelineFunnel).
const BAR_COLOR = "#3b9535";

type PartyRankingTableProps = {
	title: string;
	rows: PartyRanking[];
	valueFormatter: (value: number) => string;
};

export default function PartyRankingTable({ title, rows, valueFormatter }: PartyRankingTableProps) {
	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
			{rows.length === 0 ? (
				<p className="py-6 text-center text-sm text-muted-foreground">Sem dados no período.</p>
			) : (
				<ul className="space-y-3">
					{rows.map((row) => (
						<li key={row.nome} className="min-w-0">
							<div className="flex min-w-0 items-center justify-between gap-2 text-sm">
								<span title={row.nome} className="min-w-0 truncate text-foreground">
									{row.nome}
								</span>
								<span className="shrink-0 font-medium text-foreground">
									{valueFormatter(row.faturamento)}
								</span>
							</div>
							<div className="mt-1 flex items-center gap-2">
								<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full"
										style={{
											width: `${Math.min(100, row.percentualParticipacao)}%`,
											backgroundColor: BAR_COLOR,
										}}
									/>
								</div>
								<span className="w-12 shrink-0 text-right text-xs text-muted-foreground">
									{row.percentualParticipacao.toFixed(1)}%
								</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
