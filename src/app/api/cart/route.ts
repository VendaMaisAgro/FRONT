import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const { jwt } = await verifySession(token);

  try {
    const payload = await request.json();

    const res = await fetch(`${process.env.API_URL}/cart/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: res.ok });
  } catch (err) {
    console.log(err);
  }
}
