import { createProduct } from '@/actions/product';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CreateProductSchemaType } from '@/lib/schemas';
import {
	Check,
	ChevronLeft,
	ChevronRight,
	CircleX,
	Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { CreateProductFirstPageForm } from './CreateProductFirstPageForm';
import CreateProductSecondPageForm from './CreateProductSecondPageForm';
import CreateProductThirdPageForm from './CreateProductThirdPageForm';

type CreateProductFormProps = {
	formPosition: number;
	form: UseFormReturn<CreateProductSchemaType>;
	setFormPosition: Dispatch<SetStateAction<number>>;
	steps: { id: number; fields: string[] }[];
};

export default function CreateProductForm({
	formPosition,
	form,
	setFormPosition,
	steps,
}: CreateProductFormProps) {
	const { trigger } = form;
	type Tfields = keyof CreateProductSchemaType;
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);

	async function onSubmit(values: CreateProductSchemaType) {
		setIsSubmitting(true);

		const res = await createProduct(values);

		if (res.status === 200) {
			toast.success(`${values.name} cadastrado com sucesso!`);
			router.push('/market/myproducts');
			return;
		}
		toast.error(`Erro ao cadastrar o produto. Por favor tente novamente.`);
	}

	async function showNextForm() {
		const fields = steps[formPosition].fields;
		const validation = await trigger(fields as Tfields[], {
			shouldFocus: true,
		});

		if (!validation) return;

		if (formPosition === steps.length - 1) {
			form.handleSubmit(onSubmit)();
			return;
		}

		setFormPosition((prev) => prev + 1);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={() => {
					form.handleSubmit(onSubmit);
				}}
				className="space-y-8 max-w-2xl m-auto"
			>
				<div className="flex flex-col space-y-4 min-h-[540px]">
					{formPosition === 0 && <CreateProductFirstPageForm form={form} />}

					{formPosition === 1 && <CreateProductSecondPageForm form={form} />}

					{formPosition === 2 && <CreateProductThirdPageForm form={form} />}
				</div>

				<footer className="flex items-center justify-center gap-2 mb-14">
					{formPosition === 0 ? (
						<Link
							href="/market/myproducts"
							className="flex justify-center items-center gap-2 w-full rounded-md bg-red-500 hover:bg-red-600 h-9 px-4 py-2 font-semibold text-sm text-primary-foreground shadow-xs"
						>
							<CircleX size={18} />
							Cancelar
						</Link>
					) : (
						<Button
							type="button"
							onClick={() => setFormPosition((prev) => prev - 1)}
							className="w-1/2 bg-green-800 hover:bg-green-700"
						>
							<ChevronLeft />
							Anterior
						</Button>
					)}

					<Button
						type="button"
						onClick={() => showNextForm()}
						className="w-1/2"
						disabled={isSubmitting}
					>
						{formPosition === steps.length - 1 ? (
							isSubmitting ? (
								<>
									<Loader2 className="animate-spin" size={18} />
									Salvando...
								</>
							) : (
								<>
									<Check />
									Finalizar
								</>
							)
						) : (
							<>
								Próximo
								<ChevronRight />
							</>
						)}
					</Button>
				</footer>
			</form>
		</Form>
	);
}
