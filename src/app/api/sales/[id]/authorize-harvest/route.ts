import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function auth() {
    const token = (await cookies()).get("session")?.value;
    if (!token)
        return { error: NextResponse.json({ error: "Sessão não encontrada" }, { status: 401 }) };
    const session = await verifySession(token);
    return { jwt: session?.jwt as string | undefined };
}

export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { jwt, error } = await auth();
        if (error) return error;

        const { id } = await params;

        const res = await fetch(`${process.env.API_URL}/sales/${id}/authorize-harvest`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || data.error || "Erro ao autorizar colheita" },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("[AUTHORIZE HARVEST PATCH]", e);
        return NextResponse.json({ error: "Erro interno ao autorizar colheita" }, { status: 500 });
    }
}
