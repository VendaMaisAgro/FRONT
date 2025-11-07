import { verifySession } from "@/lib/session"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

async function auth() {
    const token = (await cookies()).get("session")?.value
    if (!token) return { error: NextResponse.json({ error: "Sessão não encontrada" }, { status: 401 }) }
    const session = await verifySession(token)
    return { jwt: session?.jwt as string | undefined, userId: session?.id }
}

export async function GET(req: NextRequest) {
    try {
        const { jwt, userId, error } = await auth()
        if (error) return error

        const sp = req.nextUrl.searchParams
        const buyerId = sp.get("buyerId") || sp.get("userId") || (sp.get("mine") ? userId : undefined)

        const url = buyerId
            ? new URL(`${process.env.API_URL}/sales/buyer/${buyerId}`)
            : new URL(`${process.env.API_URL}/sales`)

        // repassa filtros exceto controles locais
        req.nextUrl.searchParams.forEach((v, k) => {
            if (!["mine", "buyerId", "userId"].includes(k)) url.searchParams.set(k, v)
        })

        const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${jwt}` } })
        const raw = await res.json().catch(() => ({}))

        if (!res.ok) return NextResponse.json({ error: raw?.message || raw?.error || "Erro ao listar compras" }, { status: res.status })

        const list =
            Array.isArray(raw) ? raw :
                Array.isArray(raw?.purchases) ? raw.purchases :
                    Array.isArray(raw?.items) ? raw.items :
                        Array.isArray(raw?.data) ? raw.data : []

        return NextResponse.json(list)
    } catch (e) {
        console.error("[SALE GET]", e)
        return NextResponse.json({ error: "Erro interno ao listar compras" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { jwt, error } = await auth()
        if (error) return error
        const res = await fetch(`${process.env.API_URL}/sales`, {
            method: "POST",
            headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
            body: JSON.stringify(await req.json()),
        })
        return NextResponse.json(await res.json().catch(() => ({})), { status: res.status })
    } catch (e) {
        console.error("[SALE POST]", e)
        return NextResponse.json({ error: "Erro interno ao criar compra" }, { status: 500 })
    }
}