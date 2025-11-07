'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { moneyMask } from '@/utils/functions';
import { useFormContext } from 'react-hook-form';

export default function OrderSummary() {
	const { orderValue, productsAmount } = useCheckoutStore();
	const { watch } = useFormContext();
	// const insuranceId = watch('insurance');
	const payment = watch('payment');
	const transport = watch('transport');

	// const insuranceOption = insuranceOptions.find(
	// 	(o) => o.id === Number(insuranceId)
	// );
	// const insuranceCost = insuranceOption?.value || 0;
	// const insuranceLabel = insuranceOption?.title || '';

	// Shipping calculation
	// const calculateShippingCost = () => {
	// 	if (address?.type === 'retirada') {
	// 		return transportTypes['catch'][0].price;
	// 	}
	// 	return transport.reduce((acc: number, s: { transportType: string }) => {
	// 		const option = transportTypes['send'].find(
	// 			(t) => t.id === s.transportType
	// 		);
	// 		return acc + (option?.price || 0);
	// 	}, 0);
	// };
	// const shippingCost = calculateShippingCost();

	return (
		<Card className="sticky top-8">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">
					Resumo do pedido
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4 mb-4">
					{/* Produtos */}
					<div className="flex justify-between">
						<span className="text-gray-600">Produtos ({productsAmount()})</span>
						<span>{moneyMask(orderValue())}</span>
					</div>

					{/* {insuranceCost > 0 && (
						<div className="flex justify-between">
							<span className="text-gray-600">{insuranceLabel}</span>
							<span>{moneyMask(insuranceCost)}</span>
						</div>
					)} */}

					{transport.length > 0 && (
						<div className="flex justify-between">
							<span className="text-gray-600">Frete</span>
							<span>{moneyMask(0)}</span>
						</div>
					)}
				</div>

				{/* Total */}
				<div className="border-t pt-4">
					<div className="flex justify-between text-lg font-semibold text-green-600">
						<span>Você pagará</span>
						<span>{moneyMask(orderValue())}</span>
					</div>
				</div>

				{/* Pagamento */}
				{payment?.method && (
					<div className="mt-4 pt-4 border-t">
						<div className="text-sm text-gray-600">
							<strong>Pagamento:</strong> {payment.method}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
