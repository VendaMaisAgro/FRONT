"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Address } from "@/types/types";
import { MapPinPlus } from "lucide-react";
import Link from "next/link";
import { AddressCard } from "../AddressCard";

export default function AddressesClient({
	addresses,
}: {
	addresses: Address[];
}) {
	return (
		<main className="min-h-screen bg-gray-50 px-4 md:px-20 py-10 flex flex-col items-center">
			<div className="w-full max-w-4xl flex items-center justify-between mb-4">
				<nav aria-label="breadcrumb" className="text-sm text-black self-end">
					<ol className="flex flex-wrap items-center text-sm text-muted-foreground space-x-1">
						<li>
							<Link
								href="/market/profile"
								className="text-foreground hover:underline"
							>
								Meu perfil
							</Link>
						</li>
						<li>
							<span className="px-1">/</span>
						</li>
						<li className="text-foreground font-semibold">Meus endereços</li>
					</ol>
				</nav>

				<Button asChild variant="default">
					<Link href="/market/profile/personal-info/addresses/new-address">
						<MapPinPlus className="mr-1 h-4 w-4" />
						Cadastrar Endereço
					</Link>
				</Button>
			</div>

			<div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg overflow-hidden">
				{addresses.length > 0 ? (
					addresses.map((addr, idx) => (
						<div key={addr.id}>
							<AddressCard addr={addr} />
							{idx < addresses.length - 1 && <Separator className="mx-6" />}
						</div>
					))
				) : (
					<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
						<p className="text-lg text-muted-foreground mb-4">
							Você ainda não tem nenhum endereço cadastrado.
						</p>
						<Button asChild variant="default">
							<Link href="/market/profile/personal-info/addresses/new-address">
								<MapPinPlus className="mr-2 h-4 w-4" />
								Cadastrar Endereço
							</Link>
						</Button>
					</div>
				)}
			</div>
		</main>
	);
}
