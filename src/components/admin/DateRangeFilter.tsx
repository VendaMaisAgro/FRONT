"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DATE_PRESET_OPTIONS, DatePreset } from "@/lib/dateRangePresets";
import { X } from "lucide-react";

type DateRangeFilterProps = {
	preset: DatePreset | null;
	customStart: string;
	customEnd: string;
	onPresetSelect: (preset: DatePreset) => void;
	onCustomChange: (field: "start" | "end", value: string) => void;
	onClear: () => void;
};

export default function DateRangeFilter({
	preset,
	customStart,
	customEnd,
	onPresetSelect,
	onCustomChange,
	onClear,
}: DateRangeFilterProps) {
	const hasFilter = preset !== null || customStart !== "" || customEnd !== "";

	return (
		<div className="flex flex-wrap items-center gap-2">
			{DATE_PRESET_OPTIONS.map((opt) => (
				<Button
					key={opt.key}
					type="button"
					size="sm"
					variant={preset === opt.key ? "default" : "outline"}
					onClick={() => onPresetSelect(opt.key)}
				>
					{opt.label}
				</Button>
			))}
			<div className="flex items-center gap-1.5">
				<Input
					type="date"
					value={customStart}
					onChange={(e) => onCustomChange("start", e.target.value)}
					className="h-9 w-[9.5rem]"
					aria-label="Data inicial"
				/>
				<span className="text-sm text-muted-foreground">até</span>
				<Input
					type="date"
					value={customEnd}
					onChange={(e) => onCustomChange("end", e.target.value)}
					className="h-9 w-[9.5rem]"
					aria-label="Data final"
				/>
			</div>
			{hasFilter && (
				<Button type="button" size="sm" variant="ghost" onClick={onClear} className="gap-1">
					<X size={14} />
					Limpar
				</Button>
			)}
		</div>
	);
}
