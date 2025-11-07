import { SellerGroup } from "@/types/types";
import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";

interface VendorGroupProps {
	sellerData: SellerGroup;
	selectedItems: string[];
	onToggleSelect: (id: string) => void;
	onSelectVendor: (isSelected: boolean) => void;
}

const VendorGroup: React.FC<VendorGroupProps> = ({
	sellerData,
	selectedItems,
	onToggleSelect,
	onSelectVendor,
}) => {
	const [isVendorSelected, setIsVendorSelected] = useState(false);

	function handleVendorCheckboxChange() {
		onSelectVendor(!isVendorSelected);
	}

	// Verificar se todos os produtos do vendedor estão selecionados
	useEffect(() => {
		const allProductIds = sellerData.sellerProducts.map((p) => p.id);
		const areAllSelected = allProductIds.every((id) =>
			selectedItems.includes(id)
		);
		setIsVendorSelected(areAllSelected && allProductIds.length > 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedItems]);

	return (
		<div className="bg-white rounded-lg shadow mb-6">
			<div className="p-4 border-b">
				<div className="flex items-center">
					<input
						type="checkbox"
						checked={isVendorSelected}
						onChange={handleVendorCheckboxChange}
						className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
					/>
					<span className="ml-4 font-medium">{sellerData.sellerName}</span>
				</div>
			</div>

			{sellerData.sellerProducts.map((product) => {
				const isSelected = selectedItems.includes(product.id);

				return (
					<CartItem
						key={product.id}
						isSelected={isSelected}
						data={product}
						onToggleSelect={onToggleSelect}
					/>
				);
			})}
		</div>
	);
};

export default VendorGroup;
