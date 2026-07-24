"use client";

import { PipelineFunnelBucket } from "@/types/types";
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

// Série única — mesma cor validada (dataviz) usada em ForecastBarChart.tsx
const COLOR_FUNNEL = "#3b9535"; // --primary

type PipelineFunnelProps = {
	data: PipelineFunnelBucket[];
};

export default function PipelineFunnel({ data }: PipelineFunnelProps) {
	return (
		<div className="rounded-xl border border-border bg-white p-4">
			<h3 className="mb-4 text-sm font-semibold text-foreground">
				Funil de Operações
			</h3>
			<ResponsiveContainer width="100%" height={Math.max(200, data.length * 48)}>
				<BarChart
					data={data}
					layout="vertical"
					margin={{ top: 4, right: 32, left: 8, bottom: 0 }}
				>
					<CartesianGrid horizontal={false} stroke="#e1e0d9" />
					<XAxis type="number" hide />
					<YAxis
						type="category"
						dataKey="label"
						tickLine={false}
						axisLine={false}
						width={110}
						tick={{ fill: "#52514e", fontSize: 12 }}
					/>
					<Bar dataKey="count" fill={COLOR_FUNNEL} radius={[0, 4, 4, 0]} maxBarSize={28}>
						<LabelList
							dataKey="count"
							position="right"
							formatter={(value) => Number(value).toLocaleString("pt-BR")}
							style={{ fill: "#0b0b0b", fontSize: 12, fontWeight: 600 }}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
