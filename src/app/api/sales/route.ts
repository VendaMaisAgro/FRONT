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
    cache: "no-store",
  });
  
  if (res.ok) {
    const data = await res.json();
    const sales = Array.isArray(data) ? data : (data?.sales ?? []);
    const firstOrderNumber = sales[0]?.orderNumber;
    console.log(`[sales/route] endpoint: /sales/producer/${token.id} | primeiro orderNumber: ${firstOrderNumber} | total: ${sales.length}`);
    return NextResponse.json(data);
  }
  
  return NextResponse.error();
}
