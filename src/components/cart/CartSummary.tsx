'use client';

import { useCheckoutStore } from '@/store/useCheckoutStore';
import { moneyMask } from '@/utils/functions';
import Link from 'next/link';
import { FormattedCartData } from '@/types/types';
import { useRouter } from 'next/navigation';
import React from 'react';

interface CartSummaryProps {
	selectedCount: number;
	totalAmount: number;
	formattedCartData: FormattedCartData[];
}

const CartSummary: React.FC<CartSummaryProps> = ({
	selectedCount,
	totalAmount,
	formattedCartData,
}) => {
	const router = useRouter();
	const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);

	const handleContinue = () => {
		if (selectedCount === 0) return;

		const products: {
			productId: string;
			sellingUnitProductId: string;
			value: number;
			amount: number;
		}[] = [];
		let total = 0;

		const sellersData = formattedCartData.map((s) => {
			s.products.forEach((p) => {
				total += p.value * p.amount;

				products.push({
					productId: p.productId,
					sellingUnitProductId: p.sellingUnitProductId,
					value: p.value,
					amount: p.amount,
				});
			});

			return {
				sellerId: s.sellerId,
				sellerName: s.sellerName,
			};
		});

		setCheckoutData({ sellersData, products, total });

		// Navega sem query string
		router.push('/market/pre-checkout');
	};

	return (
		<div className="bg-white rounded-lg shadow p-4 sticky top-4">
			<h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>

			<div className="space-y-3 mb-6">
				<div className="flex justify-between">
					<span className="text-gray-600">Itens selecionados:</span>
					<span>{selectedCount}</span>
				</div>
				<div className="flex justify-between font-medium text-lg">
					<span>Total:</span>
					<span className="text-green-700">{moneyMask(totalAmount)}</span>
				</div>
			</div>

			<div className="mb-4">
				<button
					onClick={handleContinue}
					disabled={selectedCount === 0}
					className={`w-full py-3 rounded-lg font-medium text-white ${
						selectedCount === 0
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-green-600 hover:bg-green-700'
					}`}
				>
					Continuar
				</button>
			</div>

			<div className="text-center">
				<Link href="/" className="text-green-600 hover:text-green-800 text-sm">
					Continuar comprando
				</Link>
			</div>
		</div>
	);
};

export default CartSummary;
