import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();
		const headersList = await headers();
		const authorization = headersList.get('Authorization');

		const res = await fetch(`${process.env.API_URL}/sales`, {
			method: 'POST',
			headers: {
				Authorization: authorization as string,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const data = await res.json();

		if (res.ok)
			return NextResponse.json(
				{
					ok: res.ok,
					data: {
						id: data.id,
					},
				},
				{ status: res.status, statusText: 'Pedido realizado com sucesso!' }
			);

		return NextResponse.json(
			{
				ok: res.ok,
			},
			{
				status: res.status,
				statusText:
					data.message ??
					'Erro ao realizar o pedido, por favor verifique os dados e tente novamente.',
			}
		);
	} catch (err) {
		console.log('Erro interno na API ao realizar pedido: ', err);
		return NextResponse.json(
			{
				ok: false,
			},
			{
				status: 500,
				statusText:
					'Erro interno ao realizar o pedido, por favor tente novamente mais tarde.',
			}
		);
	}
}
