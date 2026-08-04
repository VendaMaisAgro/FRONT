import { getAlerts } from "@/actions/dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useFetchAlerts(limit: number = 50) {
	const { data: result, isLoading } = useQuery({
		queryKey: ["alerts", limit],
		queryFn: () => getAlerts({ limit }),
	});
	return { result, isLoading };
}
