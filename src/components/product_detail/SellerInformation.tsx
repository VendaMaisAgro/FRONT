import Link from "next/link";

interface SellerInformationProps {
	name: string;
	products: number;
	sellerId: number; // Adicionado para passar o ID do vendedor
}

export default function SellerInformation({
	name,
	products,
	sellerId,
}: SellerInformationProps) {
	return (
		<div className="border border-gray-200 rounded-lg p-4 mb-6">
			<div className="flex flex-col">
				<div className="mb-3">
					<h2 className="text-xl font-medium">Vendido por {name}</h2>
					<p className="text-green-600 font-medium">+{products} Produtos</p>
				</div>

				<Link
					href={`/market/seller-profile/${sellerId}?tab=todos`}
					className="w-full"
				>
					<button className="cursor-pointer w-full py-2 px-4 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
						Ver mais produtos do vendedor
					</button>
				</Link>
			</div>
		</div>
	);
}
