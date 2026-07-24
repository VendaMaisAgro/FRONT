import { getPipeline } from "@/actions/dashboard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useFetchPipeline(page: number = 1, pageSize: number = 20) {
	const { data: result, isLoading, isFetching } = useQuery({
		queryKey: ["pipeline", page, pageSize],
		queryFn: () => getPipeline({ page, pageSize }),
		placeholderData: keepPreviousData,
	});
	return { result, isLoading, isFetching };
}
