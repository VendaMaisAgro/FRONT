"use client";

type SideFilterMenu = {
	searchedProduct: string;
	amountFound: number;
};

export default function SideFilterMenu({
	searchedProduct,
	amountFound,
}: SideFilterMenu) {
	// const [sellingUnits, isLoadingSellingUnits] = useFetchSellingUnits();

	// if (isLoadingSellingUnits) {
	// 	return <SideFilterMenuSkeleton />;
	// }

	return (
		<aside className="w-72 space-y-10 hidden lg:block">
			<header>
				<h4 className="font-semibold">{searchedProduct}</h4>
				<p>{amountFound} produtos encontrados.</p>
			</header>

			{/* <div className="space-y-4">
				<h4 className="font-semibold">Preço</h4>
				<div className="flex gap-2 items-center">
					<Input placeholder="Mín." className="bg-white" />
					<Input placeholder="Máx." className="bg-white" />
					<button className="bg-primary rounded-full text-white cursor-pointer p-2">
						<ChevronRight size={16} />
					</button>
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

				<Button>Filtrar</Button>
			</div> */}
		</aside>
	);
}
