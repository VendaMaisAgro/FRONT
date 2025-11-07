import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  try {
    const body = await request.json();
    const { status } = body;

    const res = await fetch(`${process.env.API_URL}/sales/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    
    return NextResponse.error();
  } catch (error) {
    console.error("Erro ao atualizar status da venda:", error);
    return NextResponse.error();
  }
}
