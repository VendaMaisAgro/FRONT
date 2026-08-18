import { LucideIcon } from "lucide-react";

type KpiCardProps = {
	title: string;
	value: string;
	subValue?: string;
	icon?: LucideIcon;
	/** Classes de cor do badge do ícone (ex: "bg-info/10 text-info"). Só usado com tone="neutral". */
	iconClassName?: string;
	tone?: "primary" | "neutral";
};

export function KpiCard({
	title,
	value,
	subValue,
	icon: Icon,
	iconClassName = "bg-primary/10 text-primary",
	tone = "primary",
}: KpiCardProps) {
	return (
		<div
			className={
				tone === "primary"
					? "min-w-0 overflow-hidden rounded-xl bg-primary p-4 text-white"
					: "min-w-0 overflow-hidden rounded-xl border border-border bg-white p-4"
			}
		>
			<div className="flex min-w-0 items-center gap-2">
				{Icon && (
					<span
						className={
							tone === "primary"
								? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white"
								: `flex size-8 shrink-0 items-center justify-center rounded-lg ${iconClassName}`
						}
					>
						<Icon size={16} />
					</span>
				)}
				<span
					title={title}
					className={
						tone === "primary"
							? "truncate text-xs opacity-90 sm:text-sm"
							: "truncate text-xs text-muted-foreground sm:text-sm"
					}
				>
					{title}
				</span>
			</div>
			<div title={value} className="mt-2 truncate text-lg font-semibold sm:text-xl">
				{value}
			</div>
			{subValue && (
				<div
					title={subValue}
					className={
						tone === "primary"
							? "mt-0.5 truncate text-xs opacity-80"
							: "mt-0.5 truncate text-xs text-muted-foreground"
					}
				>
					{subValue}
				</div>
			)}
		</div>
	);
}
