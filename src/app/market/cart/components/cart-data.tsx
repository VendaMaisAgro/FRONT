'use client';

import CartHeader from '@/components/cart/CartHeader';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import VendorGroup from '@/components/cart/VendorGroup';
import { CartDataProduct, FormattedCartData, SellerGroup } from '@/types/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ICartDataProps {
	products: CartDataProduct[];
}

export default function CartData({ products }: ICartDataProps) {
	// const [selectAll, setSelectAll] = useState(false);
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [formattedCartData, setFormattedCartData] = useState<
		FormattedCartData[]
	>([]); //! usando isso por euquanto retorno da api não traz dados do produto corretamente

	// Agrupar produtos por vendedor
	const groupByVendor = (items: CartDataProduct[]): SellerGroup[] => {
		const groupedItems: { [key: string]: SellerGroup } = {};

		items.forEach((item) => {
			if (!groupedItems[item.product.seller.id]) {
				groupedItems[item.product.seller.id] = {
					sellerId: item.product.seller.id,
					sellerName: item.product.seller.name,
					sellerProducts: [],
				};
			}
			groupedItems[item.product.seller.id].sellerProducts.push(item);
		});

		return Object.values(groupedItems);
	};
	const vendorGroups = groupByVendor(products);
	//! essa função foi refatorada para que os pedidos só funcionem para produtos de um mesmo vendedor

	const handleToggleSelect = (id: string) => {
		if (selectedItems.includes(id)) {
			setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
		} else {
			const clickedProduct = products.find((p) => p.id === id);
			const clickedVendorId = clickedProduct?.product.seller.id;

			const hasOtherVendorProductSelected = selectedItems.some((selectedId) => {
				const product = products.find((p) => p.id === selectedId);
				return product?.product.seller.id !== clickedVendorId;
			});

			if (hasOtherVendorProductSelected) {
				toast.info(
					'No momento só é possível selecionar produtos de um único produtor. Estamos trabalhando para melhorar sua experiência.'
				);

				setSelectedItems([id]);
			} else {
				setSelectedItems([...selectedItems, id]);
			}
		}
	};

	// const handleSelectAllItems = () => {
	// 	if (selectAll) {
	// 		setSelectedItems([]);
	// 	} else {
	// 		setSelectedItems(products.map((item) => item.id));
	// 	}
	// 	setSelectAll(!selectAll);
	// };

	//! essa função foi refatorada para que os pedidos só funcionem para produtos de um mesmo vendedor
	const handleSelectVendorItems = (sellerId: string, isSelected: boolean) => {
		const vendorItemIds = vendorGroups
			.find((v) => v.sellerId === sellerId)!
			.sellerProducts.map((p) => p.id);

		if (isSelected) {
			const hasOtherVendorsSelected = products.some(
				(p) => selectedItems.includes(p.id) && p.product.seller.id !== sellerId
			);

			if (hasOtherVendorsSelected) {
				toast.info(
					'No momento só é possível selecionar produtos de um único produtor. Estamos trabalhando para melhorar sua experiência.'
				);

				return setSelectedItems([...vendorItemIds]);
			}

			setSelectedItems([
				...selectedItems,
				...vendorItemIds.filter((id) => !selectedItems.includes(id)),
			]);
		} else {
			setSelectedItems((prev) =>
				prev.filter((id) => !vendorItemIds.includes(id))
			);
		}
	};
	// Calcular o total
	const calculateTotal = () => {
		return products
			.filter((item) => selectedItems.includes(item.id))
			.reduce((sum, item) => sum + item.value, 0);
	};

	useEffect(() => {
		const selectedProductsByVendor: {
			sellerId: string;
			sellerName: string;
			products: CartDataProduct[];
		}[] = [];

		vendorGroups.forEach((group) => {
			const selectedProductsForVendor = group.sellerProducts.filter((product) =>
				selectedItems.includes(product.id)
			);

			if (selectedProductsForVendor.length > 0) {
				selectedProductsByVendor.push({
					sellerId: group.sellerId,
					sellerName: group.sellerName,
					products: selectedProductsForVendor,
				});
			}
		});

		setFormattedCartData(selectedProductsByVendor);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedItems]);

	return (
		<>
			{products.length === 0 ? (
				<EmptyCart />
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3">
						<CartHeader
						// selectAll={selectAll}
						// onSelectAll={handleSelectAllItems}
						/>
						{vendorGroups.map((group) => (
							<VendorGroup
								key={group.sellerId}
								sellerData={group}
								selectedItems={selectedItems}
								onToggleSelect={(id) => handleToggleSelect(id)}
								onSelectVendor={(isSelected) =>
									handleSelectVendorItems(group.sellerId, isSelected)
								}
							/>
						))}
					</div>
					<div className="lg:col-span-1">
						<CartSummary
							selectedCount={selectedItems.length}
							formattedCartData={formattedCartData} //! usando isso por enquanto o retorno do POST no carrinho não retorna o produto corretamente
							totalAmount={calculateTotal()}
						/>
					</div>
				</div>
			)}
		</>
	);
}
