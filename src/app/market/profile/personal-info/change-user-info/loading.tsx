"use client";

import React from "react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 md:px-20 py-10 flex flex-col items-center">
      {/* Breadcrumb skeleton */}
      <nav aria-label="breadcrumb" className="w-full max-w-4xl mb-4 animate-pulse">
        <ol className="flex flex-wrap items-center text-sm text-muted-foreground space-x-1">
          <li>
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </li>
          <li>
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </li>
          <li>
            <div className="h-4 w-48 bg-gray-300 rounded" />
          </li>
        </ol>
      </nav>

      {/* Form skeleton */}
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6 md:p-10 space-y-6">
        {/* Title skeleton */}
        <div className="animate-pulse">
          <div className="h-6 w-80 bg-gray-300 rounded mb-4" />
        </div>

        {/* Form fields skeleton */}
        <div className="space-y-6 animate-pulse">
          {/* Nome completo */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <div className="h-4 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-3 bg-gray-300 rounded-full" />
            </div>
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-3 bg-gray-300 rounded-full" />
            </div>
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* CCIR */}
          <div className="space-y-2">
            <div className="h-4 w-8 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* CNPJ */}
          <div className="space-y-2">
            <div className="h-4 w-8 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex justify-center gap-4 pt-4 animate-pulse">
          <div className="h-10 w-80 bg-gray-200 rounded flex items-center gap-2 px-4">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="h-4 w-12 bg-gray-300 rounded" />
          </div>
          <div className="h-10 w-80 bg-gray-200 rounded flex items-center gap-2 px-4">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>
        </div>
      </section>
    </main>
  );
}
