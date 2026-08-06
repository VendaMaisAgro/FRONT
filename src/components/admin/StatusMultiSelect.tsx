"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export type StatusOption = {
	stage: number;
	label: string;
	count: number;
};

type StatusMultiSelectProps = {
	options: StatusOption[];
	selected: number[];
	onChange: (stages: number[]) => void;
};

export default function StatusMultiSelect({
	options,
	selected,
	onChange,
}: StatusMultiSelectProps) {
	function toggle(stage: number) {
		onChange(
			selected.includes(stage)
				? selected.filter((s) => s !== stage)
				: [...selected, stage]
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={options.length === 0}
					className="gap-1"
				>
					Status
					{selected.length > 0 && (
						<Badge variant="secondary" className="ml-1">
							{selected.length}
						</Badge>
					)}
					<ChevronDown size={14} />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-72 p-2">
				<div className="max-h-72 space-y-0.5 overflow-y-auto">
					{options.map((opt) => (
						<div
							key={opt.stage}
							onClick={() => toggle(opt.stage)}
							className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
						>
							<Checkbox
								checked={selected.includes(opt.stage)}
								onCheckedChange={() => toggle(opt.stage)}
								onClick={(e) => e.stopPropagation()}
							/>
							<span className="flex-1">{opt.label}</span>
							<span className="text-xs text-muted-foreground">{opt.count}</span>
						</div>
					))}
				</div>
				{selected.length > 0 && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="mt-1 w-full text-muted-foreground"
						onClick={() => onChange([])}
					>
						Limpar seleção
					</Button>
				)}
			</PopoverContent>
		</Popover>
	);
}
