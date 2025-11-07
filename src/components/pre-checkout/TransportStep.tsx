import { getAddressById } from '@/actions/address';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Address, TransportTypeData } from '@/types/types';
import { moneyMask } from '@/utils/functions';
import { Handshake, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PreCheckoutFormType } from './PreCheckoutForm';
import useFetchTransportTypes from '@/hooks/useFetchTransportTypes';
import TransportStepSkeleton from './TransportStepSkeleton';

interface SellerData {
	id: string;
	name: string;
}

interface TransportStepProps {
	sellers: SellerData[];
}

export default function TransportStep({ sellers }: TransportStepProps) {
	const [addressData, setAddressData] = useState<Address>();
	const [transportTypes, isTransportTypesLoading] = useFetchTransportTypes();
	const { control, watch, getValues, setValue } =
		useFormContext<PreCheckoutFormType>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'transport',
		keyName: 'id',
	});
	const address = watch('address');

	async function getAddressData() {
		if (address.addressId) {
			const res = await getAddressById(address.addressId.toString());

			setAddressData(res);
		}
	}

	useEffect(() => {
		getAddressData();
	});

	useEffect(() => {
		const currentSellerIds = new Set(fields.map((f) => f.sellerId));
		const newSellerIds = new Set(sellers.map((s) => s.id));
		const needsStructuralUpdate =
			fields.length === 0 ||
			fields.length !== sellers.length ||
			![...newSellerIds].every((id) => currentSellerIds.has(id));

		if (needsStructuralUpdate && transportTypes) {
			remove();
			sellers.forEach((seller) => {
				append({
					sellerId: seller.id,
					transportTypeId: transportTypes[0].id,
					transport: transportTypes[0].type,
				});
			});
		}
	}, [
		sellers,
		address.type,
		fields,
		append,
		remove,
		setValue,
		getValues,
		transportTypes,
	]);

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">
				Escolha o tipo de transporte
			</h2>
			{isTransportTypesLoading ? (
				<TransportStepSkeleton />
			) : (
				<>
					{address.type !== 'retirada' && (
						<div className="flex items-center gap-2 mb-2">
							<MapPin className="text-primary" />
							<h4>
								Entrega em: {addressData?.street}, {addressData?.number},{' '}
								{addressData?.city}, {addressData?.uf}
							</h4>
						</div>
					)}
					{fields.map((field, index) => {
						const sellerName = sellers.find(
							(s) => s.id === field.sellerId
						)?.name;

						return (
							<div key={field.id} className="mb-6 p-4 border rounded-md">
								<div className="border-b border-zinc-200">
									<h3 className="text-md mb-2">
										Opções para{' '}
										<span className="font-medium text-primary">
											{sellerName}
										</span>
									</h3>
								</div>
								<div className="mt-2">
									<FormField
										control={control}
										name={`transport.${index}.transportTypeId`}
										render={({ field: transportField }) => (
											<FormItem className="space-y-3">
												<FormControl>
													<RadioGroup
														onValueChange={(v) => {
															const transport = transportTypes.find(
																(t: TransportTypeData) => t.id === v
															);

															setValue(
																`transport.${index}.transportTypeId`,
																transport.type
															);

															transportField.onChange(v);
														}}
														value={transportField.value.toString()}
														className="flex flex-col space-y-1"
													>
														{transportTypes?.map(
															(t: TransportTypeData, i: number) => {
																return (
																	<FormItem
																		key={i}
																		className="flex items-center space-x-3 space-y-0"
																	>
																		<FormControl>
																			<RadioGroupItem value={t.id.toString()} />
																		</FormControl>
																		<div className="flex-col items-center">
																			<FormLabel className="font-medium text-lg">
																				{t.type}
																			</FormLabel>
																			<FormDescription className="text-primary">
																				{t.type === 'Retirada'
																					? 'Retire com o vendedor.'
																					: 'Não foi possível calcular o tempo de entrega.'}
																			</FormDescription>
																		</div>
																		<div className="flex items-center gap-2 ml-auto text-primary font-semibold">
																			{t.type === 'Retirada' && <Handshake />}
																			<p>
																				{t.valueFreight === 0
																					? 'Grátis'
																					: moneyMask(t.valueFreight)}
																			</p>
																		</div>
																	</FormItem>
																);
															}
														)}
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
}
