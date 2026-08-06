"use server";

import { verifySession } from "@/lib/session";
import {
  AlertsResponse,
  ExecutiveOverviewResponse,
  LogisticsResponse,
  PipelineResponse,
} from "@/types/types";
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

export async function getPipeline(params?: {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  stage?: string;
}): Promise<PipelineResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  await verifySession(session);

  const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/dashboard/pipeline`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.pageSize) url.searchParams.set("pageSize", String(params.pageSize));
  if (params?.startDate) url.searchParams.set("startDate", params.startDate);
  if (params?.endDate) url.searchParams.set("endDate", params.endDate);
  if (params?.stage) url.searchParams.set("stage", params.stage);

  const res = await fetch(url, {
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

export type AlertsResult =
  | { ok: true; data: AlertsResponse }
  | { ok: false; status: number };

export async function getAlerts(params?: { limit?: number }): Promise<AlertsResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  await verifySession(session);

  const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/dashboard/alerts`);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: `session=${session}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Erro ao buscar alertas operacionais: `, res.status);
    return { ok: false, status: res.status };
  }

  const data = await res.json();
  return { ok: true, data };
}

export type LogisticsResult =
  | { ok: true; data: LogisticsResponse }
  | { ok: false; status: number };

export async function getLogistics(): Promise<LogisticsResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  await verifySession(session);

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/dashboard/logistics`, {
    method: "GET",
    headers: {
      Cookie: `session=${session}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Erro ao buscar logística e desempenho: `, res.status);
    return { ok: false, status: res.status };
  }

  const data = await res.json();
  return { ok: true, data };
}
