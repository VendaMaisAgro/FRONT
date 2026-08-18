"use client";

import { ProductRevenue } from "@/types/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Paleta categórica validada (dataviz/scripts/validate_palette.js, light, surface #ffffff,
// adjacent pairs — apropriado pra donut/pie por ter adjacência fixa no anel):
// worst adjacent CVD ΔE 9.1 (protan), normal-vision ΔE 19.6. "Outros" fica em cinza neutro
// (fora da rotação categórica), padrão comum pra bucket agregado.
const SLOT_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"];
const OUTROS_COLOR = "#9a9a95";
const MAX_SLICES = 4;

type ProductRevenueDonutProps = {
	data: ProductRevenue[];
	valueFormatter: (value: number) => string;
};

type Slice = ProductRevenue & { color: string };

function buildSlices(data: ProductRevenue[]): Slice[] {
	const sorted = [...data].sort((a, b) => b.valor - a.valor);
	const top = sorted.slice(0, MAX_SLICES).map((item, i) => ({ ...item, color: SLOT_COLORS[i] }));

	const rest = sorted.slice(MAX_SLICES);
	if (rest.length === 0) return top;

	const outros: Slice = {
		produto: "Outros",
		valor: rest.reduce((sum, item) => sum + item.valor, 0),
		percentual: rest.reduce((sum, item) => sum + item.percentual, 0),
		color: OUTROS_COLOR,
	};
	return [...top, outros];
}

export default function ProductRevenueDonut({ data, valueFormatter }: ProductRevenueDonutProps) {
	const slices = buildSlices(data);

	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-4 text-sm font-semibold text-foreground">Faturamento por Produto</h3>
			{slices.length === 0 ? (
				<p className="py-10 text-center text-sm text-muted-foreground">Sem dados no período.</p>
			) : (
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
					{/* Wrapper com dimensão fixa em CSS — o ResponsiveContainer lê o próprio
					    bounding box, então o tamanho real precisa vir de um elemento que o
					    Tailwind controla de fato (o style inline do ResponsiveContainer
					    sempre vence uma classe de largura aplicada nele mesmo). Raio em %
					    (não px) deixa o donut acompanhar esse box sem cortar as bordas. */}
					<div className="h-[160px] w-[160px] shrink-0">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={slices}
									dataKey="valor"
									nameKey="produto"
									innerRadius="60%"
									outerRadius="90%"
									paddingAngle={2}
									strokeWidth={2}
									stroke="#ffffff"
								>
									{slices.map((slice) => (
										<Cell key={slice.produto} fill={slice.color} />
									))}
								</Pie>
								<Tooltip formatter={(value) => valueFormatter(Number(value))} />
							</PieChart>
						</ResponsiveContainer>
					</div>

					<ul className="w-full min-w-0 flex-1 space-y-2">
						{slices.map((slice) => (
							<li key={slice.produto} className="flex min-w-0 items-center justify-between gap-2 text-sm">
								<span className="flex min-w-0 items-center gap-2 text-foreground">
									<span
										className="inline-block size-2.5 shrink-0 rounded-full"
										style={{ backgroundColor: slice.color }}
									/>
									<span title={slice.produto} className="min-w-0 truncate">
										{slice.produto}
									</span>
								</span>
								<span className="shrink-0 font-medium text-muted-foreground">
									{slice.percentual.toFixed(0)}%
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
