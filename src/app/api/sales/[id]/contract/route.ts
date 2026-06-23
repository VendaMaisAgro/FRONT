import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  try {
    const res = await fetch(`${process.env.API_URL}/contract/sale/${id}/context`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.jwt}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();

    if (res.ok) {
      try {
        return NextResponse.json(JSON.parse(text));
      } catch {
        return NextResponse.json({ contentResolved: text });
      }
    }

    let errData: { message?: string } = {};
    try { errData = text ? JSON.parse(text) : {}; } catch { /* ignore */ }
    return NextResponse.json(
      { error: errData.message ?? "Erro ao buscar contrato" },
      { status: res.status }
    );
  } catch (error) {
    console.error("[CONTRACT GET]", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar contrato" },
      { status: 500 }
    );
  }
}
