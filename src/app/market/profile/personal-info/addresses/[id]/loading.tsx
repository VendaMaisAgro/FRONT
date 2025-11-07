"use client";

export default function Loading() {
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto p-6">
				{/* Breadcrumb */}
				<nav aria-label="breadcrumb" className="w-full max-w-4xl mx-auto mb-6">
					<div className="flex items-center gap-2 animate-pulse">
						<div className="h-3 w-20 bg-gray-300 rounded" />
						<div className="h-3 w-3 bg-gray-200 rounded" />
						<div className="h-3 w-28 bg-gray-300 rounded" />
						<div className="h-3 w-3 bg-gray-200 rounded" />
						<div className="h-3 w-28 bg-gray-300 rounded" />
						<div className="h-3 w-3 bg-gray-200 rounded" />
						<div className="h-3 w-32 bg-gray-300 rounded" />
					</div>
				</nav>

				{/* Formulário skeleton (espelha AddressForm) */}
				<section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6 md:p-10 space-y-6 mx-auto">
					{[
						{ w1: "w-40", w2: "w-80" }, // alias
						{ w1: "w-20", w2: "w-40" }, // cep
						{ w1: "w-24", w2: "w-56" }, // uf
						{ w1: "w-24", w2: "w-56" }, // city
						{ w1: "w-28", w2: "w-full" }, // street
						{ w1: "w-20", w2: "w-32" }, // number
						{ w1: "w-32", w2: "w-64" }, // complement
						{ w1: "w-40", w2: "w-72" }, // referencePoint
						{ w1: "w-44", w2: "w-72" }, // addressee
						{ w1: "w-56", w2: "w-72" }, // phone
					].map((row, i) => (
						<div key={i} className="space-y-2">
							<div className={`h-3 ${row.w1} bg-gray-300 rounded animate-pulse`} />
							<div className={`h-10 ${row.w2} bg-gray-200 rounded animate-pulse`} />
						</div>
					))}

					{/* Botões */}
					<div className="flex flex-col sm:flex-row gap-4 pt-4">
						<div className="h-12 flex-1 bg-gray-300 rounded-md animate-pulse" />
						<div className="h-12 flex-1 bg-gray-200 rounded-md animate-pulse" />
					</div>
				</section>
			</div>
		</main>
	);
}


