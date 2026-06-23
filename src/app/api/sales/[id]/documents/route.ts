import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  try {
    const body = await request.json();

    const res = await fetch(`${process.env.API_URL}/sales/${id}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (res.ok) {
      if (!text) return NextResponse.json({ ok: true });
      try {
        return NextResponse.json(JSON.parse(text));
      } catch {
        return NextResponse.json({ ok: true });
      }
    }

    let errData: { message?: string; code?: string } = {};
    try { errData = text ? JSON.parse(text) : {}; } catch { /* ignore */ }
    return NextResponse.json(
      { error: errData.message ?? "Erro ao enviar documento" },
      { status: res.status }
    );
  } catch (error) {
    console.error("[SALES DOCUMENTS POST]", error);
    return NextResponse.json(
      { error: "Erro interno ao enviar documento" },
      { status: 500 }
    );
  }
}
