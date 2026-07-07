import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const schema = z.object({ paymentMethodId: z.string().min(1) });

async function auth() {
    const token = (await cookies()).get("session")?.value;
    if (!token)
        return { error: NextResponse.json({ error: "Sessão não encontrada" }, { status: 401 }) };
    const session = await verifySession(token);
    return { jwt: session?.jwt as string | undefined };
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { jwt, error } = await auth();
        if (error) return error;

        const { id } = await params;
        const body = await req.json();

        const validation = schema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const res = await fetch(`${process.env.API_URL}/sales/${id}/payment-method`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                {
                    error: data.message || data.error || "Erro ao alterar método de pagamento",
                    code: data.code,
                },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("[PAYMENT METHOD PATCH]", e);
        return NextResponse.json({ error: "Erro interno ao alterar método de pagamento" }, { status: 500 });
    }
}
