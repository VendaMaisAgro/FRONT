import { getPipeline } from "@/actions/dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useFetchPipeline() {
	const { data: result, isLoading } = useQuery({
		queryKey: ["pipeline"],
		queryFn: getPipeline,
	});
	return { result, isLoading };
}
