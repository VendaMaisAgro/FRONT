import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  try {
    const body = await request.json();
    const { approved } = body as { approved: boolean | null };

    const res = await fetch(
      `${process.env.API_URL}/sales/${id}/seller-decision`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
      }
    );

    const text = await res.text();
    if (res.ok) {
      if (!text) return NextResponse.json({ ok: true });
      try {
        return NextResponse.json(JSON.parse(text));
      } catch {
        return NextResponse.json({ ok: true });
      }
    }

    let message: string | undefined;
    try {
      message = text ? (JSON.parse(text)?.message ?? text) : undefined;
    } catch {
      message = text;
    }
    return NextResponse.json(
      { error: message || "Erro ao atualizar decisão do vendedor" },
      { status: res.status }
    );
  } catch (error) {
    console.error("[SELLER DECISION PATCH]", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar decisão do vendedor" },
      { status: 500 }
    );
  }
}
