"use server";

import { verifySession } from "@/lib/session";
import { ExecutiveOverviewResponse, PipelineResponse } from "@/types/types";
import { cookies } from "next/headers";

export type ExecutiveOverviewResult =
  | { ok: true; data: ExecutiveOverviewResponse }
  | { ok: false; status: number };

export async function getExecutiveOverview(): Promise<ExecutiveOverviewResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  await verifySession(session);

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/dashboard/executive-overview`, {
    method: "GET",
    headers: {
      Cookie: `session=${session}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Erro ao buscar visão executiva: `, res.status);
    return { ok: false, status: res.status };
  }

  const data = await res.json();
  return { ok: true, data };
}

export type PipelineResult =
  | { ok: true; data: PipelineResponse }
  | { ok: false; status: number };

export async function getPipeline(): Promise<PipelineResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  await verifySession(session);

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/dashboard/pipeline`, {
    method: "GET",
    headers: {
      Cookie: `session=${session}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Erro ao buscar pipeline das operações: `, res.status);
    return { ok: false, status: res.status };
  }

  const data = await res.json();
  return { ok: true, data };
}
