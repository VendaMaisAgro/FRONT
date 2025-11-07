"use client";

import React from "react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 md:px-20 py-10 flex flex-col items-center space-y-6">
      {/* Cabeçalho com avatar, nome e email */}
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-4 flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
        <div className="space-y-2">
          <div className="h-4 w-44 bg-gray-300 rounded" />
          <div className="h-3 w-56 bg-gray-200 rounded" />
        </div>
      </section>

      {/* Card de Identificação */}
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-36 bg-gray-300 rounded animate-pulse" />
          <div className="h-9 w-40 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["CNPJ", "CCIR", "Telefone", "Email"].map((_, idx) => (
            <div key={idx} className="space-y-2 animate-pulse">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Card de Usuário */}
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
          <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-300 rounded" />
        </div>
      </section>

      {/* Card de Endereço */}
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
          <div className="h-9 w-52 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-10 bg-gray-300 rounded" />
        </div>
      </section>
    </main>
  );
}


