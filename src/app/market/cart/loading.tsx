import React from "react";

export default function Loading() {
  return (
    <section className="container mx-auto px-4 py-8 animate-pulse">
      {/* Cabeçalho da tabela */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-6 flex items-center gap-3">
            <div className="h-5 w-32 bg-gray-200 rounded" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="col-span-2 flex justify-end">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Grupo(s) de vendedor */}
      {[0, 1].map((group) => (
        <div key={group} className="mt-4 bg-white rounded-xl shadow overflow-hidden">
          {/* Cabeçalho do vendedor */}
          <div className="border-b px-4 py-3 flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>

          {/* Linhas de itens */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="px-4 py-4 grid grid-cols-12 items-center gap-4 border-b last:border-b-0">
              {/* Produtos (checkbox + thumb + infos) */}
              <div className="col-span-6 flex items-center gap-4">
                <div className="w-4 h-4 rounded bg-gray-200" />
                <div className="w-20 h-20 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Valor unitário */}
              <div className="col-span-2 flex justify-center">
                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>

              {/* Quantidade (stepper) */}
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-4 w-6 bg-gray-200 rounded" />
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Sub-total + lixeira */}
              <div className="col-span-2 flex items-center justify-end gap-4">
                <div className="h-5 w-20 bg-gray-200 rounded" />
                <div className="w-5 h-5 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Resumo à direita (em telas grandes fica na lateral real, aqui abaixo no skeleton) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2" />
        <aside className="bg-white rounded-xl shadow p-4 space-y-4 h-fit">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-px w-full bg-gray-200" />
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-11 w-full bg-gray-200 rounded-lg" />
        </aside>
      </div>
    </section>
  );
}


