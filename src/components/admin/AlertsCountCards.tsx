import { AlertsCounts } from "@/types/types";
import { AlertTriangle } from "lucide-react";

const ALERT_LABELS: { key: keyof AlertsCounts; label: string }[] = [
	{ key: "semPagamentoAntesColheita", label: "Sem pagamento antes da colheita" },
	{ key: "semUploadDocumentos", label: "Sem upload de documentos" },
	{ key: "entregaAtrasada", label: "Entrega atrasada" },
	{ key: "pagamentoVencido", label: "Pagamento vencido" },
];

type AlertsCountCardsProps = {
	counts: AlertsCounts;
};

export default function AlertsCountCards({ counts }: AlertsCountCardsProps) {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{ALERT_LABELS.map(({ key, label }) => (
				<div key={key} className="rounded-xl border border-border bg-white p-4">
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm text-muted-foreground">{label}</span>
						<AlertTriangle size={18} className="text-attention" />
					</div>
					<div className="mt-1 text-2xl font-semibold text-foreground">
						{counts[key].toLocaleString("pt-BR")}
					</div>
				</div>
			))}
		</div>
	);
}
