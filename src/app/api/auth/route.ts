// src/app/api/login/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();
    const identifierType = identifier.length === 11 ? "cpf" : "cnpj";
    const payload = {
      [identifierType]: identifier,
      password: password,
    };

    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    const data = await res.json();
    const token = data.access_token as string;

    const response = NextResponse.json({
      success: true,
      access_token: token,
      email: data.user,
    });

    return response;
  } catch (err) {
    console.error("Erro no /api/login:", err);
    return NextResponse.json(
      { error: "Erro interno ao tentar fazer login." },
      { status: 500 }
    );
  }
}
