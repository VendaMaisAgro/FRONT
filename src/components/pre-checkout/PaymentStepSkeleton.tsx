import { Skeleton } from '../ui/skeleton';

export default function PaymentStepSkeleton() {
	return (
		<div className="space-y-4">
			<div className="space-y-4">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
			</div>
			<div className="space-y-4">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
			</div>
		</div>
	);
}
