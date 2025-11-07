import { Skeleton } from '../ui/skeleton';

export default function TransportStepSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-32 w-full" />
			<Skeleton className="h-32 w-full" />
		</div>
	);
}
