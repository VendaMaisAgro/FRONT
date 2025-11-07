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
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";

export default function FilterDrawerSkeleton() {
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
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
				<div className="space-y-4">
					<h4 className="font-semibold">Unidades de venda</h4>
					<ul className="space-y-2">
						{Array.from({ length: 5 }).map((_, index) => (
							<li key={index} className="flex gap-1 items-center">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-20" />
							</li>
						))}
					</ul>
				</div>
				<DrawerFooter className="px-0">
					<Skeleton className="h-10 w-full" />
					<DrawerClose></DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
