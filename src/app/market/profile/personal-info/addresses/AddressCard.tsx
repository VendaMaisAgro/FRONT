'use client';

import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Address } from '@/types/types';
import {
	MapPinHouse,
	MoreVertical,
	Pencil,
	Target,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ConfirmAddressExclusionModal from './components/ConfirmAddressExclusionModal';
import NewDefaultAddressModal from './components/NewDefaultAddressModal';

export function AddressCard({ addr }: { addr: Address }) {
	const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
	const [isNewDefaultAddressModalOpen, setIsNewDefaultAddressModalOpen] =
		useState(false);

	return (
		<>
			<div className="flex items-start justify-between px-6 py-4">
				<div className="flex items-center gap-4">
					<MapPinHouse className="mt-1 text-primary" size={24} />
					<div>
						<div className="flex items-center gap-2">
							<h4 className="text-lg font-medium text-primary">{addr.alias}</h4>
						</div>

						{addr.default && (
							<Badge
								variant="outline"
								className="text-[11px] rounded-[10px] px-[20px]"
								style={{
									backgroundColor: 'rgba(59, 149, 53, 0.25)',
									color: '#3B9535',
									border: 'none',
								}}
							>
								Padrão
							</Badge>
						)}

						<p className="text-sm text-black mt-1">
							{addr.street}, {addr.number}, {addr.complement}
							{addr.referencePoint && `, ${addr.referencePoint}`}
						</p>
						<p className="text-sm text-gray-500 mt-0.5">
							CEP {addr.cep} — {addr.city} - {addr.uf}
						</p>
						<p className="text-sm text-gray-500 mt-0.5">
							{addr.addressee} — {addr.phone_number_addressee}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-1">
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<button className="p-2 rounded-full hover:bg-gray-100">
								<MoreVertical size={20} />
							</button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end" side="bottom" className="w-56">
							{!addr.default && (
								<DropdownMenuItem
									className="flex items-center gap-2"
									onClick={() => setIsNewDefaultAddressModalOpen(true)}
								>
									<Target className="w-4 h-4" />
									Usar como padrão
								</DropdownMenuItem>
							)}

							<DropdownMenuItem className="flex items-center gap-2" asChild>
								<Link href={`/market/profile/personal-info/addresses/${addr.id}`}>
									<Pencil className="w-4 h-4" />
									Editar endereço
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<button
						className={`p-2 rounded-full transition-colors ${
							addr.default
								? 'invisible'
								: 'hover:bg-red-50 text-red-500 hover:text-red-600'
						}`}
						onClick={() => !addr.default && setIsDeletionModalOpen(true)}
						title="Apagar endereço"
					>
						<Trash2 size={18} />
					</button>
				</div>
			</div>

			<ConfirmAddressExclusionModal
				isOpen={isDeletionModalOpen}
				setIsOpen={setIsDeletionModalOpen}
				addressId={addr.id}
			/>

			<NewDefaultAddressModal
				isOpen={isNewDefaultAddressModalOpen}
				setIsOpen={setIsNewDefaultAddressModalOpen}
				address={addr}
			/>
		</>
	);
}
