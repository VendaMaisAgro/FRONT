import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!id)
			return NextResponse.json(
				{ ok: false },
				{ status: 400, statusText: "Não encontramos esse endereço." }
			);

		const headersList = await headers();
		const authorization = headersList.get("Authorization");
		const { userId } = await req.json();

		const res = await fetch(
			`${process.env.API_URL}/address/set-default/${userId}/${id}`,
			{
				method: "PUT",
				headers: {
					Authorization: authorization as string,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json(
				{ ok: res.ok },
				{
					status: res.status,
					statusText: data.message && "Operação realizada com sucesso.",
				}
			);
		}

		return NextResponse.json(
			{ ok: res.ok },
			{
				status: res.status,
				statusText: data.message && "Erro ao realizar a operação na API.",
			}
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ ok: false },
			{ status: 500, statusText: "Erro interno no servidor." }
		);
	}
}
