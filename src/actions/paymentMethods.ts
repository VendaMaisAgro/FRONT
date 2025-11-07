'use server';

import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function getAll() {
	const cookieStore = await cookies();
	const session = cookieStore.get('session')?.value;
	const { jwt } = await verifySession(session);

	try {
		const res = await fetch(`${process.env.API_URL}/payment-methods`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		const data = await res.json();

		if (!res.ok) {
			console.error(`Erro ao buscar métodos de pagamento: `, res);

			return [];
		}

		return data;
	} catch (error) {
		console.log('Erro interno ao buscar métodos de pagamento:', error);

		return [];
	}
}
