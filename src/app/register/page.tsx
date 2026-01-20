'use client';
import RegisterForm from '@/components/register/RegisterForm';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { useState } from 'react';

export default function RegisterPage() {
	const searchParams = useSearchParams();
	const asParam = searchParams.get('as');

	let registerAs: 'distributor' | 'cooperative-or-partnership' | 'farmer' =
		'distributor';

	if (asParam === 'Comprador/Distribuidor') {
		registerAs = 'distributor';
	} else if (
		asParam === 'cooperative-or-partnership' ||
		asParam === 'farmer' ||
		asParam === 'distributor'
	) {
		registerAs = asParam;
	}

	const [selectedUserType, setSelectedUserType] = useState<
		'distributor' | 'cooperative-or-partnership' | 'farmer'
	>(registerAs);

	const userTypeImages = {
		distributor: '/Buyer-Distributor.JPG',
		'cooperative-or-partnership': '/Cooperative-Association.JPG',
		farmer: '/Rural Producer.JPG',
	};

	return (
		<div className="bg-background min-h-screen flex flex-col md:flex-row">
			<div className="w-full md:w-[40%] px-8 md:px-20 pt-20 pb-10 flex flex-col relative">
				<RegisterForm
					registerAs={registerAs ?? 'distributor'}
					onUserTypeChange={setSelectedUserType}
				/>
			</div>

			<div className="hidden md:flex w-[60%] relative">
				<Image
					src={userTypeImages[selectedUserType]}
					alt="Imagem agrícola"
					fill
					className="object-cover"
					priority
				/>

				<Image
					src="/logoVenda+Agromarket.svg"
					alt="Logo Venda+ Agromarket"
					width={160}
					height={40}
					className="absolute top-6 left-6"
					priority
				/>
			</div>
		</div>
	);
}
