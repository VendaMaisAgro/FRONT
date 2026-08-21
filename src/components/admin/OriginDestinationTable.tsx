import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { OriginDestinationRoute } from "@/types/types";

type OriginDestinationTableProps = {
	data: OriginDestinationRoute[];
	valueFormatter: (value: number) => string;
};

export default function OriginDestinationTable({ data, valueFormatter }: OriginDestinationTableProps) {
	const sorted = [...data].sort((a, b) => b.valor - a.valor);

	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-1 text-sm font-semibold text-foreground">Origem x Destino</h3>
			<p className="mb-4 text-xs text-muted-foreground">Rotas por UF (12 meses)</p>
			{sorted.length === 0 ? (
				<p className="py-6 text-center text-sm text-muted-foreground">Sem dados no período.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Origem</TableHead>
							<TableHead>Destino</TableHead>
							<TableHead className="text-right">Qtd.</TableHead>
							<TableHead className="text-right">Valor</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sorted.map((route, i) => (
							<TableRow key={`${route.origem}-${route.destino}-${i}`}>
								<TableCell>{route.origem}</TableCell>
								<TableCell>{route.destino}</TableCell>
								<TableCell className="text-right">
									{route.quantidade.toLocaleString("pt-BR")}
								</TableCell>
								<TableCell className="text-right">{valueFormatter(route.valor)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
