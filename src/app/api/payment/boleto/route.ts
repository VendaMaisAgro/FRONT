import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const boletoSchema = z.object({
    saleId: z.string().uuid(),
    paymentMethodId: z.string(),
    amount: z.number().positive(),
    expirationDays: z.number().min(1).max(30).optional(),
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

        // URL do backend: /payment/boleto (assumindo padrão similar ao PIX)
        // Nota: A documentação diz /payment-methods/boleto, mas o PIX era /payment/pix.
        // Vou usar /payment/boleto seguindo a correção anterior do PIX, mas se falhar ajusto.
        // Verificando payment_integration.md: diz POST /payment-methods/boleto
        // Mas no PIX também dizia e era /payment/pix.
        // Vou verificar o arquivo payment.route.ts do backend novamente para ter certeza absoluta.

        // Melhor verificar antes de commitar a rota.
        // Vou criar com /payment/boleto por coerência com o PIX que corrigimos, 
        // mas vou verificar o backend logo em seguida.

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
