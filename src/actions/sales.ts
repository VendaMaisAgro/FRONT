"use server";

import { cookies } from "next/headers";
import { SalesApiResponse } from "@/types/types";

export async function getSalesData(): Promise<SalesApiResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;


  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales`, {
      method: "GET",
      headers: {
        "Cookie": `session=${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const data: SalesApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados de vendas:", error);
    throw new Error("Erro ao carregar dados de vendas");
  }
}

export async function updateSaleStatus(saleId: string, status: string): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales/${saleId}`, {
      method: "PUT",
      headers: {
        "Cookie": `session=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar status da venda:", error);
    throw new Error("Erro ao atualizar status da venda");
  }
}

export async function updateSellerDecision(
  saleId: string,
  approved: boolean | null
): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/sales/${saleId}/seller-decision`,
      {
        method: "PATCH",
        headers: {
          Cookie: `session=${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao atualizar decisão do vendedor: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar decisão do vendedor:", error);
    throw new Error("Erro ao atualizar decisão do vendedor");
  }
}