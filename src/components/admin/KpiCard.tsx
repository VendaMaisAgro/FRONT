import { LucideIcon } from "lucide-react";

type KpiCardProps = {
	title: string;
	value: string;
	subValue?: string;
	icon?: LucideIcon;
	tone?: "primary" | "neutral";
};

export function KpiCard({ title, value, subValue, icon: Icon, tone = "primary" }: KpiCardProps) {
	return (
		<div
			className={
				tone === "primary"
					? "rounded-xl bg-primary p-5 text-white"
					: "rounded-xl border border-border bg-white p-5"
			}
		>
			<div className="flex items-center justify-between gap-2">
				<span className={tone === "primary" ? "text-sm opacity-90" : "text-sm text-muted-foreground"}>
					{title}
				</span>
				{Icon && <Icon size={18} className={tone === "primary" ? "opacity-90" : "text-muted-foreground"} />}
			</div>
			<div className="mt-1 text-2xl font-semibold">{value}</div>
			{subValue && (
				<div className={tone === "primary" ? "mt-0.5 text-xs opacity-80" : "mt-0.5 text-xs text-muted-foreground"}>
					{subValue}
				</div>
			)}
		</div>
	);
}
