import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  const res = await fetch(`${process.env.API_URL}/sales/producer/${token.id}`, {
    headers: {
      Authorization: `Bearer ${token.jwt}`,
    },
  });
  
  if (res.ok) {
    const data = await res.json();
    return NextResponse.json(data);
  }
  
  return NextResponse.error();
}
