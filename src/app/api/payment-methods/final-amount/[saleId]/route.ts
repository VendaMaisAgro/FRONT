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

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ saleId: string }> }
) {
    try {
        const { jwt, error } = await auth();
        if (error) return error;

        const { saleId } = await params;

        const res = await fetch(`${process.env.API_URL}/payment-methods/sales/${saleId}/final-amount`, {
            method: "GET",
            headers: { Authorization: `Bearer ${jwt}` },
        });

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
            const text = await res.text();
            console.error("[FINAL AMOUNT GET] Resposta não-JSON:", res.status, text.substring(0, 300));
            return NextResponse.json(
                { error: `Endpoint não disponível (HTTP ${res.status}). Verifique se o backend implementou GET /payment-methods/sales/:saleId/final-amount` },
                { status: res.ok ? 502 : res.status }
            );
        }

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || data.error || "Erro ao calcular valor final" },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("[FINAL AMOUNT GET]", e);
        return NextResponse.json({ error: "Erro interno ao calcular valor final" }, { status: 500 });
    }
}
