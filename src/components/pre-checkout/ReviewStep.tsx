'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Package } from 'lucide-react';
import type { PreCheckoutFormType } from './PreCheckoutForm';
import { getAddressById } from '@/actions/address';
import { useEffect, useState } from 'react';
import { Address } from '@/types/types';
import {
	getDescription,
	getIcon,
} from '@/utils/mappers/mapPaymentMethodToData';

interface ReviewStepProps {
	sellers: Array<{ id: string; name: string }>;
	setStep: (step: number) => void;
}

export default function ReviewStep({ sellers, setStep }: ReviewStepProps) {
	const [addressData, setAddressData] = useState<Address>();
	const { watch } = useFormContext<PreCheckoutFormType>();
	// const insurance = watch("insurance");
	const address = watch('address');
	const transport = watch('transport');
	const payment = watch('payment');

	async function getAddressData() {
		if (address.addressId) {
			const res = await getAddressById(address.addressId.toString());

			setAddressData(res);
		}
	}

	useEffect(() => {
		getAddressData();
	});

	// const getInsuranceInfo = () => {
	//     const insuranceTypes = {
	//         "0": { label: "Básico", description: "Roubo, extravio, avaria física" },
	//         "1": { label: "Perecíveis", description: "Deterioração por atraso" },
	//         "2": { label: "All Risk", description: "Todos os riscos acima" }
	//     };

	//     return insuranceTypes[insurance as keyof typeof insuranceTypes] || insuranceTypes["0"];
	// };

	const getTransportDataForSeller = (sellerId: string) => {
		const transportItem = transport?.find(
			(t: { sellerId: string }) => t.sellerId === sellerId
		);
		const sellerName =
			sellers.find((s) => s.id === sellerId)?.name || `Vendedor ${sellerId}`;

		if (!transportItem) return null;

		return {
			seller: sellerName,
			transport: transportItem.transport,
		};
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold mb-2">Revisão</h2>
				<p className="text-gray-600">
					Confira os dados do seu pedido antes de finalizar
				</p>
			</div>

			<div className="space-y-4">
				{/* <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Seguro</p>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="font-normal">{getInsuranceInfo().label}</span>
                                        {insurance === "2" && (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                                RECOMENDADO
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">{getInsuranceInfo().description}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 p-0 h-auto"
                                onClick={() => setStep(0)}
                            >
                                Alterar
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}

				{/* Endereço */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
									<MapPin className="w-5 h-5 text-green-600" />
								</div>
								<div>
									<p className="font-medium text-gray-900">Endereço</p>
									<p className="flex items-center gap-2 text-gray-700">
										{address?.type === 'retirada' ? 'Retirada' : 'Entrega'}
									</p>
									<p className="text-sm text-gray-600">
										{address?.type === 'retirada'
											? 'Retire no endereço do produtor.'
											: addressData
											? `${addressData.street}, ${addressData.number} - ${addressData.city} - ${addressData.uf}`
											: 'Endereço não informado'}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-green-600 p-0 h-auto"
								onClick={() => setStep(0)}
							>
								Alterar
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Tipo de Transporte */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
									<Package className="w-5 h-5 text-purple-600" />
								</div>
								<div>
									<p className="font-medium text-gray-900">
										Tipo de Transporte
									</p>
									<div className="space-y-1">
										{sellers.map((seller) => {
											const transportData = getTransportDataForSeller(
												seller.id
											);

											return (
												<div key={seller.id}>
													<span className="text-gray-700">
														{transportData?.seller}
													</span>
													<p className="text-sm text-gray-600">
														{transportData?.transport === 'Retirada'
															? 'Retire com o vendedor.'
															: 'Não foi possível calcular o tempo de entrega.'}
													</p>
												</div>
											);
										})}
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-green-600 p-0 h-auto"
								onClick={() => setStep(1)}
							>
								Alterar
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Pagamento */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
									{getIcon(payment.method.toLowerCase())}
								</div>
								<div>
									<p className="font-medium text-gray-900">Pagamento</p>
									<p className="flex items-center text-gray-700">
										{payment.method}
									</p>
									<p className="text-sm text-gray-600">
										{getDescription(payment.method.toLowerCase())}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-green-600 p-0 h-auto"
								onClick={() => setStep(2)}
							>
								Alterar
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
