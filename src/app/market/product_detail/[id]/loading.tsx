import React from "react"

export default function Loading() {
  return (
    <div className="p-4 space-y-8 animate-pulse">
      {/* Topo - Imagens + Infos */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Coluna das imagens */}
        <div className="flex gap-3">
          {/* Miniaturas */}
          <div className="flex flex-col gap-3">
            <div className="w-16 h-16 rounded-md bg-gray-200" />
            <div className="w-16 h-16 rounded-md bg-gray-200" />
            <div className="w-16 h-16 rounded-md bg-gray-200" />
            <div className="w-16 h-16 rounded-md bg-gray-200" />
          </div>
          {/* Imagem principal */}
          <div className="w-96 h-96 rounded-lg bg-gray-200" />
        </div>

        {/* Coluna das infos do produto */}
        <div className="flex-1 space-y-4">
          <div className="h-7 w-full rounded bg-gray-200" /> {/* título */}
          <div className="h-4 w-1/2 rounded bg-gray-200" /> {/* estrelas */}
          <div className="h-9 w-1/3 rounded bg-gray-200" /> {/* preço */}

          {/* Quantidade + Unidade */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-32 rounded bg-gray-200" />
            <div className="h-9 w-24 rounded bg-gray-200" />
          </div>

          {/* Links adicionais */}
          <div className="space-y-2">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-4 w-1/4 rounded bg-gray-200" />
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <div className="h-11 w-full rounded-lg bg-gray-200" />
            <div className="h-11 w-full rounded-lg bg-gray-200" />
            <div className="h-12 w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Seção do Vendedor */}
      <div className="border rounded-lg p-4 space-y-4">
        {/* Nome + Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
          </div>
        </div>

        {/* Selo */}
        <div className="h-4 w-1/4 rounded bg-gray-200" />

        {/* Barra de performance */}
        <div className="h-3 w-full rounded bg-gray-200" />

        {/* Botão */}
        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}
