import { Skeleton } from "@/components/ui/skeleton";

export default function SideFilterMenuSkeleton() {
	return (
		<aside className="w-72 space-y-10 hidden lg:block">
			<header>
				<Skeleton className="h-6 w-40 mb-2 bg-neutral-300" />
				<Skeleton className="h-4 w-32 bg-neutral-300" />
			</header>

			<div className="space-y-4">
				<Skeleton className="h-5 w-16 mb-2 bg-neutral-300" />
				<div className="flex gap-2 items-center">
					<Skeleton className="h-10 w-full bg-neutral-300" />
					<Skeleton className="h-10 w-full bg-neutral-300" />
					<Skeleton className="h-10 w-10 rounded-full bg-neutral-300" />
				</div>
			</div>

			<div className="space-y-4">
				<Skeleton className="h-5 w-48 mb-2 bg-neutral-300" />
				<ul className="space-y-2">
					{Array(5)
						.fill(0)
						.map((_, index) => (
							<li key={index} className="flex gap-1 items-center">
								<Skeleton className="h-4 w-4 bg-neutral-300" />
								<Skeleton className="h-4 w-24 bg-neutral-300" />
							</li>
						))}
				</ul>

				<Skeleton className="h-10 w-full mt-4 bg-neutral-300" />
			</div>
		</aside>
	);
}
