'use client';

import { readProductById } from '@/actions/product';
import { createProductSchema, CreateProductSchemaType } from '@/lib/schemas';
import { newProductFormSteps } from '@/utils/data';
import { moneyMask } from '@/utils/functions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CreateProductForm from './components/createProductForm';

export default function CadastrarProduto() {
	const [formPosition, setFormPosition] = useState<number>(0);
	const searchParams = useSearchParams();
	const productId = searchParams.get('retrieveDataFrom');
	const form = useForm<CreateProductSchemaType>({
		resolver: zodResolver(createProductSchema),
		defaultValues: {
			name: '',
			variety: '',
			category: '',
			amount: '',
			description: '',
			sellingUnits: [],
			images: [],
			isNegotiable: false,
		},
	});
	useEffect(() => {
		async function fetchAndSetProductData() {
			if (productId) {
				try {
					const data = await readProductById(productId);

					const newDefaultValues = {
						name: data.name,
						category: data.category,
						amount: data.stock.toString(),
						description: data.description,
						sellingUnits: data.sellingUnitsProduct.map(
							(su: {
								minPrice: number;
								unitId: string;
								unit: { unit: string };
							}) => {
								return {
									minPrice: moneyMask(su.minPrice),
									unitId: su.unitId,
									acronym: su.unit.unit,
								};
							}
						),
						images: [],
						isNegotiable: data.isNegotiable,
						harvestAt: new Date(data.harvestAt),
						createdAt: data.createdAt,
						variety: data.variety,
					};

					form.reset(newDefaultValues);
				} catch (error) {
					console.log(error);
					toast.error(
						'Erro ao recuperar as informações do produto a ser duplicado. Por favor tente novamente.'
					);
				}
			}
		}

		fetchAndSetProductData();
	}, [productId, form]);

	return (
		<section className="max-w-7xl mx-auto p-6">
			<header className="space-y-1 mb-6">
				<h1 className="text-2xl font-bold">
					{form.getValues('name')
						? form.getValues('name')
						: 'Cadastrar produto'}
				</h1>
				<p className="text-gray-600">
					{newProductFormSteps[formPosition].description}
				</p>
				<p>
					Passo {formPosition + 1} de {newProductFormSteps.length}
				</p>
			</header>
			<CreateProductForm
				form={form}
				formPosition={formPosition}
				setFormPosition={setFormPosition}
				steps={newProductFormSteps}
			/>
		</section>
	);
}
