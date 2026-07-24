import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  const { searchParams } = new URL(request.url);
  const upstreamUrl = new URL(`${process.env.API_URL}/dashboard/pipeline`);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  if (page) upstreamUrl.searchParams.set("page", page);
  if (pageSize) upstreamUrl.searchParams.set("pageSize", pageSize);

  const res = await fetch(upstreamUrl, {
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
