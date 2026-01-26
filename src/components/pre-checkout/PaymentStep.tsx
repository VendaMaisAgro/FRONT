'use client';

import { useFormContext, Controller } from 'react-hook-form';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import useFetchPaymentMethods from '@/hooks/useFetchPaymentMethods';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { PaymentMethodsData } from '@/types/types';
import {
	getDescription,
	getIcon,
	isWip,
} from '@/utils/mappers/mapPaymentMethodToData';
import { useEffect } from 'react';
import PaymentStepSkeleton from './PaymentStepSkeleton';

export default function PaymentStep() {
	const { control, setValue } = useFormContext();
	const [paymentMethods, isPaymentMethodsLoading] = useFetchPaymentMethods();

	useEffect(() => {
		if (paymentMethods) {
			const method = paymentMethods[0];

			setValue('payment.methodId', method.id);
			setValue('payment.method', method.method);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentMethods]);

	return (
		<>
			<FormField
				control={control}
				name="payment.methodId"
				render={() => (
					<FormItem>
						<FormLabel className="text-lg font-semibold">Pagamento</FormLabel>

						{isPaymentMethodsLoading ? (
							<PaymentStepSkeleton />
						) : (
							<FormControl>
								<Controller
									control={control}
									name="payment.methodId"
									render={({ field }) => (
										<RadioGroup
											value={field.value && field.value.toString()}
											onValueChange={(v) => {
												const method = paymentMethods.find(
													(m: PaymentMethodsData) => m.id === v
												);

												setValue('payment.method', method.method);
												field.onChange(v);
											}}
											className="space-y-4"
										>
											<div className="space-y-4">
												<h3 className="font-medium text-gray-700">
													Transferências
												</h3>

												{paymentMethods.map(
													(method: PaymentMethodsData, i: number) => {
														const methodIdentifier =
															method.method.toLowerCase();
														let wipMethod = isWip(methodIdentifier);

														// Validação de valor mínimo para Boleto
														const { orderValue } = useCheckoutStore.getState();
														const totalValue = orderValue();
														const isBoleto = methodIdentifier.includes('boleto');
														const minBoletoValue = 4.00;

														if (isBoleto && totalValue < minBoletoValue) {
															wipMethod = true; // Desabilita se valor for menor que o mínimo
														}

														return (
															<div
																key={i}
																className={`flex items-center space-x-3 p-4 border rounded-lg ${wipMethod
																	? 'cursor-not-allowed opacity-60'
																	: 'hover:bg-gray-50'
																	}`}
															>
																<RadioGroupItem
																	disabled={wipMethod}
																	value={method.id.toString()}
																/>

																<div className="flex items-center gap-3">
																	{getIcon(methodIdentifier)}
																	<div>
																		<Label
																			htmlFor="pix"
																			className={`${wipMethod && 'text-neutral-500'
																				} 'font-medium'`}
																		>
																			{method.method}
																		</Label>

																		<p
																			className={`text-sm ${wipMethod
																				? 'text-neutral-400'
																				: 'text-green-600'
																				}`}
																		>
																			{wipMethod
																				? isBoleto && totalValue < minBoletoValue
																					? `Mínimo de R$ ${minBoletoValue.toFixed(2).replace('.', ',')} para Boleto`
																					: 'Em desenvolvimento...'
																				: getDescription(methodIdentifier)}
																		</p>
																	</div>
																</div>
															</div>
														);
													}
												)}
											</div>
											{/* 
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-gray-700">Cartões</h3>
                                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                                                <RadioGroupItem value="credit-card" id="credit-card" />
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                        {options.find(o => o.id === 'credit-card')!.icon}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="credit-card" className="font-medium">Novo cartão de crédito</Label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-medium text-gray-700">Outras formas de pagamento</h3>
                                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                                                <RadioGroupItem value="boleto" id="boleto" />
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                                                        {options.find(o => o.id === 'boleto')!.icon}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="boleto" className="font-medium">Boleto Bancário</Label>
                                                        <p className="text-sm text-green-600">Aprovação em 1 a 2 dias úteis</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
										</RadioGroup>
									)}
								/>
							</FormControl>
						)}

						<FormMessage />
					</FormItem>
				)}
			/>

			{/* {method === 'credit-card' && (
				<FormField
					control={control}
					name="payment.cardNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor="cardNumber">Número do cartão</FormLabel>
							<FormControl>
								<Input
									id="cardNumber"
									placeholder="0000 0000 0000 0000"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}

			{method === 'credit-card' && (
				<div className="grid grid-cols-1 gap-4">
					<FormField
						control={control}
						name="payment.cardName"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="cardName">Nome no cartão</FormLabel>
								<FormControl>
									<Input
										id="cardName"
										placeholder="Nome como está no cartão"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={control}
							name="payment.cardExpiry"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="cardExpiry">Validade</FormLabel>
									<FormControl>
										<Input id="cardExpiry" placeholder="MM/AA" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="payment.cardCvv"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="cardCvv">CVV</FormLabel>
									<FormControl>
										<Input id="cardCvv" placeholder="123" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			)} */}
		</>
	);
}
