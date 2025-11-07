'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import OrderSummary from '@/components/pre-checkout/OrderSummary';
import PreCheckoutForm from '@/components/pre-checkout/PreCheckoutForm';
import { preCheckoutSchema } from '@/lib/schemas';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { checkoutSteps } from '@/utils/data';

type PreCheckoutFormType = z.infer<typeof preCheckoutSchema>;

export default function PreCheckoutPage() {
	const [step, setStep] = useState(0);
	const router = useRouter();
	const { data } = useCheckoutStore();

	const methods = useForm<PreCheckoutFormType>({
		resolver: zodResolver(preCheckoutSchema),
		defaultValues: {
			address: { type: 'retirada' },
			transport: [],
			payment: {},
		},
		mode: 'all',
	});

	useEffect(() => {
		if (!data) {
			router.replace('/market');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<FormProvider {...methods}>
			<div className="bg-background min-h-screen flex flex-col">
				<div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-8 gap-8">
					{/* Passos do checkout */}
					<div className="flex-1 lg:w-[60%]">
						<div className="flex items-center justify-between mb-8">
							{checkoutSteps.map((checkoutStep) => {
								const isLast = checkoutStep.id < checkoutSteps.length - 1;
								return (
									<div
										key={checkoutStep.id}
										className={`flex items-center ${isLast ? 'w-full' : ''}`}
									>
										<div
											className={`size-8 p-5 rounded-full flex items-center justify-center text-sm font-medium ${
												checkoutStep.id <= step
													? 'bg-green-600 text-white font-semibold'
													: 'bg-gray-200 text-gray-400'
											}`}
										>
											{checkoutStep.id + 1}
										</div>
										{isLast && (
											<div
												className={`flex flex-col-reverse items-center w-full h-0.5 mx-2 ${
													checkoutStep.id < step
														? 'bg-green-600'
														: 'bg-gray-200'
												}`}
											>
												<span
													className={`text-xs mb-1 hidden sm:block ${
														checkoutStep.id < step
															? 'text-green-600'
															: 'text-gray-400'
													}`}
												>
													{checkoutSteps[checkoutStep.id + 1].title}
												</span>
											</div>
										)}
									</div>
								);
							})}
						</div>

						<PreCheckoutForm step={step} setStep={setStep} />
					</div>

					{/* Sumário do pedido lê diretamente do Zustand */}
					<div className="lg:w-[40%] lg:max-w-md">
						<OrderSummary />
					</div>
				</div>
			</div>
		</FormProvider>
	);
}
