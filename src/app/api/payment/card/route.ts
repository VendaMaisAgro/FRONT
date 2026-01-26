import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const cardSchema = z.object({
    saleId: z.string().uuid(),
    paymentMethodId: z.string(),
    amount: z.number().positive(),
    token: z.string(),
    installments: z.number().int().min(1).max(24),
    paymentMethodType: z.string(),
    cardPaymentMethodId: z.string(),
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
        const validation = cardSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: validation.error.format() },
                { status: 400 }
            );
        }

        // URL do backend: /payment/card (seguindo padrão PIX e Boleto)
        const res = await fetch(`${process.env.API_URL}/payment/card`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            const errorMessage = data.message || data.error || "Erro ao processar pagamento com cartão";
            return NextResponse.json(
                { error: errorMessage },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("[PAYMENT CARD POST]", e);
        return NextResponse.json(
            { error: "Erro interno ao processar pagamento com cartão" },
            { status: 500 }
        );
    }
}
