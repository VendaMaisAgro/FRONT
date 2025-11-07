"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetchSellingUnits from "@/hooks/useFetchSellingUnits";
import { SellingUnit } from "@/types/types";
import { SlidersHorizontal } from "lucide-react";
import FilterDrawerSkeleton from "./filterDrawerSkeleton";

export default function FilterDrawer() {
	const [sellingUnits, isSellingUnitsLoading] = useFetchSellingUnits();

	if (isSellingUnitsLoading) {
		return <FilterDrawerSkeleton />;
	}

	return (
		<Drawer>
			<DrawerTrigger className="flex items-center gap-2 cursor-pointer text-primary font-semibold lg:hidden my-4">
				<SlidersHorizontal size={16} />
				<h4>Filtros</h4>
			</DrawerTrigger>
			<DrawerContent className="px-10 space-y-4">
				<DrawerHeader>
					<DrawerTitle>Painel de filtros</DrawerTitle>
					<DrawerDescription>
						Aplique filtros aos produtos pesquisados.
					</DrawerDescription>
				</DrawerHeader>
				<div className="space-y-4">
					<h4 className="font-semibold">Preço</h4>
					<div className="flex gap-2 items-center">
						<Input placeholder="Mín." className="bg-white" />
						<Input placeholder="Máx." className="bg-white" />
					</div>
				</div>
				<div className="space-y-4">
					<h4 className="font-semibold">Unidades de venda</h4>
					<ul className="space-y-2">
						{sellingUnits.map((unit: SellingUnit) => {
							return (
								<li key={unit.id} className="flex gap-1 text-sm text-zinc-500">
									<Checkbox id={unit.id.toString()} />
									<Label htmlFor={unit.id.toString()}>{unit.title}</Label>
								</li>
							);
						})}
					</ul>
				</div>
				<DrawerFooter className="px-0">
					<Button>Filtrar</Button>
					<DrawerClose></DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
