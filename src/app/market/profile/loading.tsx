"use client";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 md:px-20 py-10 flex flex-col items-center space-y-6">
      {/* Skeleton do cabeçalho do usuário */}
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-4 flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-300 rounded"></div>
        </div>
      </section>

      {/* Skeleton da lista de opções */}
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6 md:p-10 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-lg border border-border animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div className="space-y-1">
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </div>
        ))}
      </section>
    </main>
  );
}
