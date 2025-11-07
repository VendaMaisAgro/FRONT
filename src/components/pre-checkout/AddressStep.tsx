'use client';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function AddressStep() {
	const { control, watch, setValue } = useFormContext();
	const deliveryType = watch('address.type');
	// const selectedAddressId = watch('address.addressId');
	// const [addresses, setAddresses] = useState<Address[]>([]);
	// const [loading, setLoading] = useState(false);
	// const [loadError, setLoadError] = useState<string | null>(null);
	// const [openAdd, setOpenAdd] = useState(false);

	useEffect(() => {
		setValue('address.type', deliveryType, { shouldValidate: true });
		if (deliveryType === 'retirada') {
			setValue('address.addressId', undefined, { shouldValidate: true });
		}
	}, [deliveryType, setValue]);

	// async function refreshAddresses() {
	// 	setLoading(true);
	// 	setLoadError(null);

	// 	const data = await getAddresses();

	// 	setAddresses(data);

	// 	if (data.length) {
	// 		if (!watch('address.addressId')) {
	// 			setValue('address.addressId', data[0].id);
	// 		} else {
	// 			setValue('address.addressId', getValues('address.addressId'));
	// 		}
	// 	}

	// 	setLoading(false);
	// }

	// useEffect(() => {
	// 	if (deliveryType !== 'entrega') return;
	// 	refreshAddresses();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [deliveryType]);

	// async function createNewAddress(data: AddressFormValues) {
	// 	try {
	// 		await createAddress(data);
	// 		toast.success('Endereço cadastrado com sucesso!');
	// 		await refreshAddresses();
	// 		setOpenAdd(false);
	// 	} catch (err) {
	// 		console.error(err);
	// 		toast.error('Erro ao cadastrar endereço.');
	// 	}
	// }

	return (
		<>
			{/* Escolha do tipo de entrega */}
			<FormField
				control={control}
				name="address.type"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-lg font-semibold">Entrega</FormLabel>
						<FormControl>
							<RadioGroup
								value={field.value}
								onValueChange={field.onChange}
								className="space-y-4"
							>
								<div className="flex items-start space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50">
									<RadioGroupItem
										value="retirada"
										id="retirada"
										className="mt-1"
									/>
									<div className="flex-1">
										<Label htmlFor="retirada" className="font-medium">
											Retirada
										</Label>
										<p className="text-sm text-gray-600 mt-1">
											Retire no endereço do produtor
										</p>
									</div>
									<div className="text-right">
										<span className="text-green-600 font-medium">Grátis</span>
									</div>
								</div>

								{/* <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50">
									<RadioGroupItem
										value="entrega"
										id="entrega"
										className="mt-1"
									/>
									<div className="flex-1">
										<Label htmlFor="entrega" className="font-medium">
											Enviar no meu endereço
										</Label>
										<p className="text-sm text-gray-600 mt-1">
											Selecione um endereço cadastrado abaixo.
										</p>
									</div>
									<div className="text-right">
										<span className="text-green-600 font-medium">
											A calcular
										</span>
									</div>
								</div> */}
							</RadioGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* {deliveryType === 'entrega' && (
				<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
					{loading && (
						<p className="text-sm text-gray-600">Carregando endereços...</p>
					)}
					{!loading && loadError && (
						<p className="text-sm text-red-600">{loadError}</p>
					)}

					{!loading && !loadError && (
						<>
							{addresses.length > 0 ? (
								<FormField
									control={control}
									name="address.addressId"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<RadioGroup
													value={field.value ? String(field.value) : ''}
													onValueChange={(v) => field.onChange(Number(v))}
													className="space-y-3"
												>
													{addresses.map((a) => {
														const selected = Number(selectedAddressId) === a.id;
														return (
															<label
																key={a.id}
																htmlFor={`addr-${a.id}`}
																className={cn(
																	'flex items-start gap-3 p-3 border rounded-lg bg-white cursor-pointer',
																	selected
																		? 'border-green-600 ring-1 ring-green-600'
																		: ''
																)}
															>
																<RadioGroupItem
																	value={String(a.id)}
																	id={`addr-${a.id}`}
																	className="mt-1"
																/>
																<div className="flex-1">
																	<div className="flex items-center gap-2">
																		<span className="font-medium">
																			{a.alias || 'Endereço'}
																		</span>
																		{a.addressee && (
																			<span className="text-xs text-gray-500">
																				• {a.addressee}
																			</span>
																		)}
																	</div>
																	<p className="text-sm text-gray-600">
																		{a.street}, {a.number} — {a.city}/{a.uf} •
																		CEP {a.cep}
																	</p>
																	{a.complement && (
																		<p className="text-xs text-gray-500">
																			{a.complement}
																		</p>
																	)}
																	{a.referencePoint && (
																		<p className="text-xs text-gray-500">
																			Ref.: {a.referencePoint}
																		</p>
																	)}
																</div>
															</label>
														);
													})}
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							) : (
								<div className="p-4 border rounded-md bg-white">
									<p className="text-sm text-gray-600">
										Você ainda não possui endereços cadastrados.
									</p>
								</div>
							)}

							<div className="pt-2">
								<Dialog open={openAdd} onOpenChange={setOpenAdd}>
									<DialogTrigger asChild>
										<button
											type="button"
											className="inline-flex items-center gap-2 px-4 h-10 rounded-md border bg-white hover:bg-gray-50"
										>
											<Plus className="w-4 h-4" />
											Adicionar outro endereço
										</button>
									</DialogTrigger>

									<DialogContent className="fixed left-0 top-0 translate-x-0 translate-y-0 w-screen h-[100dvh] max-w-none rounded-none p-0 overflow-hidden">
										<div className="flex h-full min-h-0 flex-col bg-background">
											<div className="shrink-0 sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background px-4 py-3 md:px-6">
												<DialogTitle className="text-base md:text-lg">
													Novo endereço
												</DialogTitle>
												<DialogClose asChild>
													<button
														aria-label="Fechar"
														className="rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
													>
														<svg
															viewBox="0 0 24 24"
															className="h-5 w-5"
															fill="none"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="2"
																d="M6 18L18 6M6 6l12 12"
															/>
														</svg>
													</button>
												</DialogClose>
											</div>

											<div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-8 md:py-8">
												<div className="mx-auto w-full max-w-4xl">
													<TanstackProvider>
														<AddressForm
															onSubmit={createNewAddress}
															onFormDismiss={() => setOpenAdd(false)}
														/>
													</TanstackProvider>
												</div>
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</>
					)}
				</div>
			)} */}
		</>
	);
}
