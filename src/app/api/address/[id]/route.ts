import { verifySession } from "@/lib/session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("session")?.value;
		const { id } = await params;

		if (!token) {
			return NextResponse.json(
				{ error: "Sessão não encontrada" },
				{ status: 401 }
			);
		}

		const session = await verifySession(token);
		const { jwt } = session;

		const res = await fetch(`${process.env.API_URL}/address/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: "Erro ao excluir endereço" },
				{ status: res.status }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[API ADDRESS DELETE]", error);
		return NextResponse.json(
			{ error: "Erro interno ao excluir endereço" },
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
				{ status: 400, statusText: "Não encontramos esse endereço." }
			);

		const headersList = await headers();
		const authorization = headersList.get("Authorization");
		const payload = await req.json();

		const res = await fetch(`${process.env.API_URL}/address/${id}`, {
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
			{ status: 500, statusText: "Erro interno no servidor." }
		);
	}
}

/*import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getJwt() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const { jwt } = await verifySession(token);
  return jwt;
}

// GET /api/address/:id  -> backend: GET /address/:id
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const jwt = await getJwt();

    const res = await fetch(`${process.env.API_URL}/address/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });

    // Para GET, retornamos o JSON do backend (mantendo o status)
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// PUT /api/address/:id  -> backend: PUT /address/:id
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const jwt = await getJwt();
    const payload = await request.json();

    const res = await fetch(`${process.env.API_URL}/address/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: res.ok }, { status: res.status });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// DELETE /api/address/:id -> backend: DELETE /address/:id
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const jwt = await getJwt();

    const res = await fetch(`${process.env.API_URL}/address/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return NextResponse.json({ ok: res.ok }, { status: res.status });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
*/
