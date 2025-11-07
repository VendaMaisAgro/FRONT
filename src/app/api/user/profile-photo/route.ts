import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const { jwt, id } = await verifySession(token);

  try {
    const incomingFormData = await request.formData();

    const res = await fetch(`${process.env.API_URL}/user/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: incomingFormData,
    });

    if (!res.ok) {
      let errorMessage = 'Erro ao atualizar foto de perfil';
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const errorJson = await res.json();
          errorMessage = errorJson?.message || JSON.stringify(errorJson) || errorMessage;
        } else {
          const txt = await res.text();
          errorMessage = txt || `Erro ${res.status}: ${res.statusText}`;
        }
      } catch {
        errorMessage = `Erro ${res.status}: ${res.statusText}`;
      }
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    // Resposta de sucesso do backend com a URL da imagem
    let data;
    try {
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        // Alguns backends retornam só a URL em texto
        const url = await res.text();
        data = { img: url };
      }
    } catch {
      return NextResponse.json(
        { error: 'Resposta inválida do servidor' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[API USER PROFILE-PHOTO PUT]", err);
    return NextResponse.json(
      { error: "Erro interno ao atualizar foto de perfil" },
      { status: 500 }
    );
  }
}
