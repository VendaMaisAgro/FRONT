import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  const res = await fetch(`${process.env.API_URL}/dashboard/pipeline`, {
    headers: {
      Authorization: `Bearer ${token.jwt}`,
    },
    cache: "no-store",
  });

  if (res.ok) {
    const data = await res.json();
    return NextResponse.json(data);
  }

  return NextResponse.json(
    { error: "Erro ao buscar pipeline das operações" },
    { status: res.status }
  );
}
