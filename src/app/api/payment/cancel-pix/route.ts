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

export async function POST(req: NextRequest) {
    try {
        const { jwt, error } = await auth();
        if (error) return error;

        const body = await req.json();
        const { paymentId } = body;

        if (!paymentId) {
            return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
        }

        // URL corrigida: /payment/{id}/cancel (definida em payment.route.ts e montada em /payment)
        const res = await fetch(`${process.env.API_URL}/payment/${paymentId}/cancel`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            const errorMessage = data.message || data.error || "Erro ao cancelar pagamento";
            return NextResponse.json(
                { error: errorMessage },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("[PAYMENT CANCEL POST]", e);
        return NextResponse.json(
            { error: "Erro interno ao cancelar pagamento" },
            { status: 500 }
        );
    }
}
