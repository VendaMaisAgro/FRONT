'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { preCheckoutSchema } from '@/lib/schemas';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { checkoutSteps } from '@/utils/data';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
import * as z from 'zod';
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import TermsStep from './TermsStep';
import TransportStep from './TransportStep';
import { createNewOrder } from '@/actions/order';
import { toast } from 'sonner';
import TanstackProvider from '@/providers/tanstackProvider';
import { useRouter } from 'next/navigation';

export type PreCheckoutFormType = z.infer<typeof preCheckoutSchema>;

interface IPreCheckoutFormProps {
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
}

export default function PreCheckoutForm({
	step,
	setStep,
}: IPreCheckoutFormProps) {
	const form = useFormContext<PreCheckoutFormType>();
	const { trigger, control, handleSubmit } = form;
	const { getSellers, getProducts } = useCheckoutStore();
	const sellers = getSellers();
	const router = useRouter();

	async function onSubmit(values: PreCheckoutFormType) {
		const products = getProducts();

		const payload = {
			transportTypeId: values.transport[0].transportTypeId,
			addressId: null,
			transportValue: 0, //! era pro back cuidar disso lol
			paymentMethodId: values.payment.methodId,
			boughtProducts: products.map((p) => ({
				productId: p.productId,
				sellingUnitProductId: p.sellingUnitProductId,
				amount: p.amount,
			})),
		};

		const res = await createNewOrder(payload);

		if (res.success) {
			toast.success(res.message);

			router.push('/market/history');
			return;
		}

		toast.error(res.message);
	}

	async function showNextForm() {
		const fields = checkoutSteps[step]?.fields ?? [];
		const valid = await trigger(fields as (keyof PreCheckoutFormType)[], {
			shouldFocus: true,
		});
		if (!valid) return;

		if (step < checkoutSteps.length - 1) {
			setStep(step + 1);
		} else {
			handleSubmit(onSubmit)();
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					showNextForm();
				}}
				className="space-y-6"
			>
				{/* {step === 0 && (
					<FormField
						name="insurance"
						control={control}
						render={({ field }) => <InsuranceStep {...field} />}
					/>
				)} */}

				{step === 0 && (
					<FormField
						name="address"
						control={control}
						render={() => <AddressStep />}
					/>
				)}

				{step === 1 && (
					<TanstackProvider>
						<FormField
							name="transport"
							control={control}
							render={() => <TransportStep sellers={sellers} />}
						/>
					</TanstackProvider>
				)}

				{step === 2 && (
					<TanstackProvider>
						<FormField
							name="payment"
							control={control}
							render={() => <PaymentStep />}
						/>
					</TanstackProvider>
				)}
				{step === 3 && <ReviewStep sellers={sellers} setStep={setStep} />}

				{step === 4 && <FormField name="terms" render={() => <TermsStep />} />}

				<div className="flex justify-between pt-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => setStep((s) => Math.max(0, s - 1))}
						disabled={step === 0}
						className="px-6"
					>
						Voltar
					</Button>

					<Button
						type="button"
						className="px-6 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
						onClick={showNextForm}
					>
						{step === checkoutSteps.length ? 'Finalizar Compra' : 'Continuar'}
						{/* Funcionou */}
					</Button>
				</div>
			</form>
		</Form>
	);
}
