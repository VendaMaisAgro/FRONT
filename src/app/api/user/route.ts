import { deleteSession, verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
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
		const { jwt, id } = session;

		const res = await fetch(`${process.env.API_URL}/user/${id}`, {
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: "Erro ao buscar usuário" },
				{ status: res.status }
			);
		}

		const user = await res.json();
		return NextResponse.json(user);
	} catch (error) {
		console.error("[API USER GET]", error);
		return NextResponse.json(
			{ error: "Erro interno ao buscar usuário" },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
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
		const { jwt, id } = session;

		const body = await req.json();
		const { email, phone: phone_number, img } = body;

		const res = await fetch(`${process.env.API_URL}/user/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify({ email, phone_number, img }),
		});

		if (!res.ok) {
			const error = await res.json();
			return NextResponse.json(
				{ error: error.message || "Erro ao atualizar usuário" },
				{ status: res.status }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[API USER PUT]", error);
		return NextResponse.json(
			{ error: "Erro interno ao atualizar usuário" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	try {
		const res = await fetch(`${process.env.API_URL}/user/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json(
				{
					ok: res.ok,
					data: {
						message: data.message ?? "Cadastro realizado com sucesso!",
					},
				},
				{
					status: res.status,
				}
			);
		}

		return NextResponse.json(
			{
				ok: res.ok,
				data: {
					message:
						// data.error ??
						/*! Aguardar melhor tratamento de erro do backend para conseguir
						 indicar melhor o erro no front*/

						"Erro ao realizar cadastro, por favor verifique seu dados e tente novamente.",
				},
			},
			{
				status: res.status,
			}
		);
	} catch (err) {
		console.error("Erro interno ao realizar cadastro: ", err);
		return NextResponse.json(
			{
				ok: false,
				data: {
					message:
						"Erro interno ao processar o cadastro, por favor tente novamente.",
				},
			},
			{
				status: 500,
			}
		);
	}
}

export async function DELETE() {
	await deleteSession();

	return NextResponse.json({
		success: true,
		message: "Logged out successfully.",
	});
}
