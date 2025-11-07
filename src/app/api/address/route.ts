// app/api/address/route.tsx
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getJwt() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const { jwt } = await verifySession(token);
    return jwt;
}

// GET /api/address?userId=123  -> backend: GET /address/user/:userId
export async function GET(request: NextRequest) {
    try {
        const jwt = await getJwt();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        if (!userId) {
            return NextResponse.json({ ok: false, error: "userId é obrigatório" }, { status: 400 });
        }

        const res = await fetch(`${process.env.API_URL}/address/user/${userId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
            cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

// POST /api/address?userId=123 -> backend: POST /address/:userId
export async function POST(request: NextRequest) {
    try {
        const jwt = await getJwt();

        const url = new URL(request.url);
        const qsUserId = url.searchParams.get("userId");
        const payload = await request.json();
        const userId = qsUserId ?? payload?.userId;

        if (!userId) {
            return NextResponse.json({ ok: false, error: "userId é obrigatório" }, { status: 400 });
        }

        if ("userId" in payload) delete payload.userId;

        const res = await fetch(`${process.env.API_URL}/address/${userId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return NextResponse.json({ ok: res.ok }, { status: res.status });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
