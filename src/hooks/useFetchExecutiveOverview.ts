import { getExecutiveOverview } from "@/actions/dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useFetchExecutiveOverview() {
	const { data: result, isLoading } = useQuery({
		queryKey: ["executive-overview"],
		queryFn: getExecutiveOverview,
	});
	return { result, isLoading };
}
