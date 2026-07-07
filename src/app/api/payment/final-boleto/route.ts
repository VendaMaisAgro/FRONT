import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const schema = z.object({
    saleId: z.string().uuid(),
    paymentMethodId: z.string().min(1),
    amount: z.number().positive().optional(),
});

async function auth() {
    const token = (await cookies()).get("session")?.value;
    if (!token)
        return { error: NextResponse.json({ error: "Sessão não encontrada" }, { status: 401 }) };
    const session = await verifySession(token);
    return { jwt: session?.jwt as string | undefined };
}

export async function POST(req: NextRequest) {
    try {
        const { jwt, error } = await auth();
        if (error) return error;

        const body = await req.json();
        const validation = schema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 });
        }

        const res = await fetch(`${process.env.API_URL}/payment-methods/final-boleto`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
            const text = await res.text();
            console.error("[FINAL BOLETO POST] Resposta não-JSON:", res.status, text.substring(0, 200));
            return NextResponse.json(
                { error: `Endpoint não disponível no backend (HTTP ${res.status})` },
                { status: res.ok ? 502 : res.status }
            );
        }

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || data.error || "Erro ao gerar boleto final" },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("[FINAL BOLETO POST]", e);
        return NextResponse.json({ error: "Erro interno ao gerar boleto final" }, { status: 500 });
    }
}
