export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />

      {/* Barra de ações (filtros + botão cadastrar) */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border p-4 shadow-sm bg-white flex flex-col space-y-3"
          >
            {/* Nome + Tag negociável */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>

            {/* Categoria / Variedade */}
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />

            {/* Datas */}
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />

            {/* Preço */}
            <div className="h-6 w-28 bg-gray-200 rounded" />

            {/* Botões */}
            <div className="flex gap-2 mt-4">
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
