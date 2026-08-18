import { AlertsCounts } from "@/types/types";
import { AlertTriangle, CalendarClock, FileText, LucideIcon, Truck } from "lucide-react";

const ALERT_LABELS: {
	key: keyof AlertsCounts;
	label: string;
	icon: LucideIcon;
	iconClassName: string;
}[] = [
	{
		key: "semPagamentoAntesColheita",
		label: "Sem pagamento",
		icon: AlertTriangle,
		iconClassName: "bg-destructive/10 text-destructive",
	},
	{
		key: "semUploadDocumentos",
		label: "Sem documentos",
		icon: FileText,
		iconClassName: "bg-attention/10 text-attention",
	},
	{
		key: "entregaAtrasada",
		label: "Entrega atrasada",
		icon: Truck,
		iconClassName: "bg-attention/10 text-attention",
	},
	{
		key: "pagamentoVencido",
		label: "Pagamento vencido",
		icon: CalendarClock,
		iconClassName: "bg-destructive/10 text-destructive",
	},
];

type AlertsCountCardsProps = {
	counts: AlertsCounts;
};

export default function AlertsCountCards({ counts }: AlertsCountCardsProps) {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{ALERT_LABELS.map(({ key, label, icon: Icon, iconClassName }) => (
				<div key={key} className="rounded-xl border border-border bg-white p-4">
					<div className="flex items-center gap-2.5">
						<span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
							<Icon size={18} />
						</span>
						<span className="text-sm text-muted-foreground">{label}</span>
					</div>
					<div className="mt-2 text-2xl font-semibold text-foreground">
						{counts[key].toLocaleString("pt-BR")}
					</div>
				</div>
			))}
		</div>
	);
}
