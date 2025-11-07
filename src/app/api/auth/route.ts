// src/app/api/login/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { formatCpfCnpj } from "@/utils/functions";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();
    // Remove caracteres não numéricos para verificar o comprimento
    const cleanedIdentifier = identifier.replace(/\D/g, "");
    const identifierType = cleanedIdentifier.length === 11 ? "cpf" : "cnpj";
    // Formata o identifier antes de enviar ao backend
    const formattedIdentifier = formatCpfCnpj(identifier);
    const payload = {
      [identifierType]: formattedIdentifier,
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
