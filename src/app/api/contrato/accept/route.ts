import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  try {
    const body = await request.json();

    const res = await fetch(`${process.env.API_URL}/contract/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown = {};
    try { data = text ? JSON.parse(text) : {}; } catch { /* ignore */ }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[CONTRACT ACCEPT]", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar aceite do contrato" },
      { status: 500 }
    );
  }
}
