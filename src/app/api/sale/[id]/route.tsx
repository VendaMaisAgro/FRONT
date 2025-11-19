import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isValidUUID } from "@/lib/validation";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Validar formato do UUID
    if (!isValidUUID(id)) {
        return NextResponse.json(
            { error: "ID inválido" },
            { status: 400 }
        );
    }

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Sessão não encontrada" },
                { status: 401 }
            );
        }

        const session = await verifySession(token);
        const { jwt } = session;

        const res = await fetch(`${process.env.API_URL}/sales/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(
                { error: error.message || "Erro ao buscar dados de compra" },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json({ data });
    } catch (error) {
        console.error("[API SALES GET]", error);
        return NextResponse.json(
            { error: "Erro interno ao buscar compras" },
            { status: 500 }
        );
    }
}