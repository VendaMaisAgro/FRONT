import { getLogistics } from "@/actions/dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useFetchLogistics() {
	const { data: result, isLoading } = useQuery({
		queryKey: ["logistics"],
		queryFn: getLogistics,
	});
	return { result, isLoading };
}
