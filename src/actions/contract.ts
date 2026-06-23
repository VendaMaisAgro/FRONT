"use server";

import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import type { ContractSnapshot } from "@/store/useCheckoutStore";

export interface ContractAcceptPayload extends ContractSnapshot {
  saleId: string;
}

export interface ContractViewData {
  contract: Record<string, unknown>;
  ok: boolean;
  error?: string;
}

const API_URI = process.env.NEXT_PUBLIC_URL;
const API_URL = process.env.API_URL;

/**
 * Fetches contract context and product harvestAt in parallel, server-side.
 * Avoids two browser→proxy→backend round-trips: the browser makes one call to
 * the Next.js server which fans out to the backend concurrently (server-to-server).
 */
export async function getContractView(saleId: string, productId?: string): Promise<ContractViewData> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const { jwt } = await verifySession(token);

    const headers = { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" };

    const [contractRes, productRes] = await Promise.all([
      fetch(`${API_URL}/contract/sale/${saleId}/context`, { headers, cache: "no-store" }),
      productId ? fetch(`${API_URL}/products/${productId}`, { headers, cache: "no-store" }) : Promise.resolve(null),
    ]);

    const contractText = await contractRes.text();
    let contract: Record<string, unknown> = {};
    try { contract = JSON.parse(contractText); } catch { contract = { contentResolved: contractText }; }

    if (!contractRes.ok) {
      return { contract, ok: false, error: (contract as { message?: string }).message ?? "Erro ao carregar contrato" };
    }

    // Inject harvestAt when context doesn't have it yet (until backend saves full snapshot)
    if (productRes?.ok) {
      const product = await productRes.json().catch(() => null) as Record<string, unknown> | null;
      const harvestAt = product?.harvestAt as string | undefined;
      const conditions = contract.conditions as Record<string, unknown> | undefined;
      if (harvestAt && !conditions?.plannedHarvestDate) {
        contract.conditions = { ...(conditions ?? {}), plannedHarvestDate: harvestAt };
      }
    }

    return { contract, ok: true };
  } catch (err) {
    console.error("[getContractView]", err);
    return { contract: {}, ok: false, error: "Erro interno ao carregar contrato" };
  }
}

export async function acceptContract(payload: ContractAcceptPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const { jwt } = await verifySession(token);

    // Call backend directly (server-to-server) to avoid cookie forwarding issues
    const res = await fetch(`${API_URL}/contract/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string; message?: string };
      return { success: false, error: data.error ?? data.message ?? "Erro ao registrar aceite" };
    }

    return { success: true };
  } catch (err) {
    console.error("[acceptContract]", err);
    return { success: false, error: "Erro interno ao registrar aceite" };
  }
}
