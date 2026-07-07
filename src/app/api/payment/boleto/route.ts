import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const boletoSchema = z.object({
    saleId: z.string().uuid(),
    paymentMethodId: z.string(),
    // Para phase down_payment o backend calcula o valor correto e ignora este campo
    amount: z.number().positive().optional(),
    expirationDays: z.number().min(1).max(30).optional(),
    phase: z.enum(["down_payment", "final_payment", "full"]).optional(),
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

        // Validar dados
        const validation = boletoSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: validation.error.format() },
                { status: 400 }
            );
        }

        const res = await fetch(`${process.env.API_URL}/payment/boleto`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            const errorMessage = data.message || data.error || "Erro ao criar boleto";
            return NextResponse.json(
                { error: errorMessage },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("[PAYMENT BOLETO POST]", e);
        return NextResponse.json(
            { error: "Erro interno ao criar boleto" },
            { status: 500 }
        );
    }
}
