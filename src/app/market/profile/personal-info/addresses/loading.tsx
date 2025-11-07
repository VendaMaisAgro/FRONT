"use client";

export default function Loading() {
	return (
		<main className="min-h-screen bg-gray-50 px-4 md:px-20 py-10 flex flex-col items-center">
			{/* Cabeçalho: breadcrumb + botão */}
			<div className="w-full max-w-4xl flex items-center justify-between mb-4">
				{/* Breadcrumb */}
				<div className="text-sm text-muted-foreground self-end animate-pulse">
					<div className="h-3 w-20 bg-gray-300 rounded" />
				</div>
				{/* Botão "Cadastrar Endereço" */}
				<div className="h-9 w-44 bg-gray-300 rounded-md animate-pulse" />
			</div>

			{/* Lista de cards */}
			<section className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg overflow-hidden">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className="">
						{/* Card */}
						<div className="flex items-start justify-between px-6 py-4">
							<div className="flex items-start gap-4 w-full">
								{/* Ícone */}
								<div className="w-6 h-6 bg-gray-300 rounded-full mt-1 animate-pulse" />
								{/* Texto */}
								<div className="flex-1 space-y-2 animate-pulse">
									<div className="h-4 w-40 bg-gray-300 rounded" />
									<div className="h-3 w-72 bg-gray-200 rounded" />
									<div className="h-3 w-56 bg-gray-200 rounded" />
									<div className="h-3 w-64 bg-gray-200 rounded" />
								</div>
							</div>
							{/* Menu 3 pontos */}
							<div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
						</div>
						{/* Separator entre cards */}
						{index < 2 && <div className="h-px bg-gray-200 mx-6" />}
					</div>
				))}
			</section>
		</main>
	);
}


