// components/Hero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
	return (
		<section className="relative h-screen bg-black">
			<Image
				src="/logoVenda+Agromarket.svg"
				alt="Hero image"
				width={500}
				height={500}
				className="absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 invisible sm:visible"
			/>

			<Image
				src="/hero-background.jpg"
				alt="Hero image"
				className="object-cover opacity-60"
				fill
			/>

			<div className="absolute bg-white p-6 rounded-md left-1/2 z-20 flex flex-col transform -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-4/5 gap-6 shadow-lg w-5/6 md:w-auto">
				<div className="space-y-2">
					<h4 className="text-lg font-medium">Já possui uma conta?</h4>
					<Link href="/login">
						<button className="cursor-pointer w-full bg-green-700 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
							Entrar
						</button>
					</Link>
				</div>

				<div className="space-y-2">
					<h4 className="text-lg font-medium">Cadastre-se</h4>
					<div className="flex flex-col gap-3 md:flex-row">
						<Link href="/register?as=distributor">
							<button className="cursor-pointer bg-amber-800 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
								Sou Distribuidor
							</button>
						</Link>

						<Link href="/register?as=cooperative-or-partnership">
							<button className="cursor-pointer bg-amber-900 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
								Sou Cooperativa/Associação
							</button>
						</Link>

						<Link href="/register?as=farmer">
							<button className="cursor-pointer bg-amber-950 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
								Produtor Rural
							</button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
