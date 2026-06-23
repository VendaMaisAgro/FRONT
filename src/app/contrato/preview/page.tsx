"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContractTemplate, { PreCheckoutData } from "@/components/sale/ContractTemplate";
import type { ContractContextData } from "@/components/sale/ContractTemplate";
import { Printer, X, LoaderCircle } from "lucide-react";

type ContractState =
  | { status: "loading" }
  | { status: "preCheckout"; data: PreCheckoutData }
  | { status: "context"; data: ContractContextData }
  | { status: "error"; message: string }
  | { status: "empty" };

export default function ContratoPreviewPage() {
  const searchParams = useSearchParams();
  const saleId = searchParams.get("saleId");
  const [state, setState] = useState<ContractState>({ status: "loading" });

  useEffect(() => {
    if (saleId) {
      // Fetch persisted contract from backend
      fetch(`/api/sales/${saleId}/contract`, { credentials: "include" })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error ?? "Erro ao carregar contrato");
          setState({ status: "context", data });
        })
        .catch((e: unknown) =>
          setState({ status: "error", message: e instanceof Error ? e.message : "Erro ao carregar contrato" })
        );
      return;
    }

    // Fallback: pre-checkout data from sessionStorage (no saleId yet)
    try {
      const raw = sessionStorage.getItem("contractPreviewData");
      if (raw) {
        setState({ status: "preCheckout", data: JSON.parse(raw) });
      } else {
        setState({ status: "empty" });
      }
    } catch {
      setState({ status: "empty" });
    }
  }, [saleId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Print toolbar — hidden on actual print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b flex items-center justify-between px-6 py-3 shadow-sm">
        <span className="font-semibold text-gray-800">Termo de Venda — Venda+ Agromarket</span>
        <div className="flex items-center gap-3">
          {state.status !== "loading" && state.status !== "error" && state.status !== "empty" && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              Salvar como PDF / Imprimir
            </button>
          )}
          <button
            onClick={() => window.close()}
            className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            Fechar
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {state.status === "loading" && (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-400">
            <LoaderCircle className="w-6 h-6 animate-spin" />
            Carregando contrato...
          </div>
        )}

        {state.status === "error" && (
          <div className="text-center py-20 text-red-500">
            <p className="text-lg font-medium">Erro ao carregar contrato</p>
            <p className="text-sm mt-2">{state.message}</p>
          </div>
        )}

        {state.status === "empty" && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Nenhum dado de contrato encontrado.</p>
            <p className="text-sm mt-2">Acesse esta página a partir do processo de compra.</p>
          </div>
        )}

        {state.status === "preCheckout" && (
          <ContractTemplate mode="read-only" preCheckoutData={state.data} />
        )}

        {state.status === "context" && (
          <ContractTemplate mode="read-only" data={state.data} />
        )}
      </div>

      <style>{`
        @media print {
          body { margin: 0; }
        }
      `}</style>
    </div>
  );
}
