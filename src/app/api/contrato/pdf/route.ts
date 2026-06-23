import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  try {
    const res = await fetch(`${process.env.API_URL}/contract/pdf?kind=sale_tos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar PDF do contrato" },
        { status: res.status }
      );
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="termo-de-venda.pdf"',
      },
    });
  } catch (error) {
    console.error("[CONTRACT PDF]", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar PDF" },
      { status: 500 }
    );
  }
}
