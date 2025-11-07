import { verifySession } from "@/lib/session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("session")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "Sessão não encontrada" },
				{ status: 401 }
			);
		}

		const session = await verifySession(token);
		const { jwt } = session;

		const res = await fetch(`${process.env.API_URL}/cart/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});

		if (!res.ok) {
			const error = await res.json();
			return NextResponse.json(
				{ error: error.message || "Erro ao buscar dados do carrinho" },
				{ status: res.status }
			);
		}

		const data = await res.json();

		return NextResponse.json({ data });
	} catch (error) {
		console.error("[API CART GET]", error);
		return NextResponse.json(
			{ error: "Erro interno ao buscar carrinho" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!id)
			return NextResponse.json(
				{ ok: false },
				{ status: 400, statusText: "Não foi fornecido nenhum ID." }
			);

		const headersList = await headers();
		const authorization = headersList.get("Authorization");
		const payload = await req.json();

		const res = await fetch(`${process.env.API_URL}/cart/item/${id}`, {
			method: "PUT",
			headers: {
				Authorization: authorization as string,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

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
			{ status: 500, statusText: "Erro interno no servidor do Next." }
		);
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("session")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "Sessão não encontrada" },
				{ status: 401 }
			);
		}

		const session = await verifySession(token);
		const { jwt } = session;

		const res = await fetch(`${process.env.API_URL}/cart/item/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});

		return NextResponse.json({ ok: res.ok });
	} catch (error) {
		console.error("[API CART GET]", error);
		return NextResponse.json(
			{ error: "Erro interno ao buscar carrinho" },
			{ status: 500 }
		);
	}
}
