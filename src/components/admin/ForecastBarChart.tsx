"use client";

import { MonthlyForecastActual } from "@/types/types";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

// Validado com dataviz/scripts/validate_palette.js (light, surface #ffffff) — all checks pass.
const COLOR_REALIZADO = "#3b9535"; // --primary
const COLOR_PREVISTO = "#2f80ed"; // --info

const SERIES_LABEL: Record<string, string> = {
	previsto: "Previsto",
	realizado: "Realizado",
};

type ForecastBarChartProps = {
	title: string;
	data: MonthlyForecastActual[];
	valueFormatter?: (value: number) => string;
};

export default function ForecastBarChart({
	title,
	data,
	valueFormatter,
}: ForecastBarChartProps) {
	const formatValue = valueFormatter ?? ((value: number) => value.toLocaleString("pt-BR"));

	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
			<ResponsiveContainer width="100%" height={260}>
				<BarChart data={data} barGap={2} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
					<CartesianGrid vertical={false} stroke="#e1e0d9" />
					<XAxis
						dataKey="label"
						tickLine={false}
						axisLine={{ stroke: "#c3c2b7" }}
						tick={{ fill: "#898781", fontSize: 12 }}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tick={{ fill: "#898781", fontSize: 12 }}
						tickFormatter={formatValue}
						width={64}
					/>
					<Tooltip
						formatter={(value) => formatValue(Number(value))}
						contentStyle={{ borderRadius: 8, borderColor: "#e1e0d9", fontSize: 12 }}
					/>
					<Legend
						iconType="circle"
						wrapperStyle={{ fontSize: 12, color: "#52514e" }}
						formatter={(value: string) => SERIES_LABEL[value] ?? value}
					/>
					<Bar dataKey="previsto" name="previsto" fill={COLOR_PREVISTO} radius={[4, 4, 0, 0]} maxBarSize={24} />
					<Bar dataKey="realizado" name="realizado" fill={COLOR_REALIZADO} radius={[4, 4, 0, 0]} maxBarSize={24} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
