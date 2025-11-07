"use server";

import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

export async function getAllSellingUnits() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  await verifySession(session);

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sellingUnits`, {
    method: "GET",
    headers: {
      Cookie: `session=${session}`,
    },
  });

  if (!res.ok) {
    console.error(`Erro ao buscar unidades de venda: `, res);
    return [];
  }

  return await res.json();
}
