import { getPipeline } from "@/actions/dashboard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export type PipelineFilters = {
	page?: number;
	pageSize?: number;
	startDate?: string;
	endDate?: string;
	stage?: number[];
};

export default function useFetchPipeline(filters: PipelineFilters = {}) {
	const { page = 1, pageSize = 20, startDate, endDate, stage } = filters;
	const stageParam =
		stage && stage.length > 0 ? [...stage].sort((a, b) => a - b).join(",") : undefined;

	const { data: result, isLoading } = useQuery({
		queryKey: ["pipeline", page, pageSize, startDate, endDate, stageParam],
		queryFn: () => getPipeline({ page, pageSize, startDate, endDate, stage: stageParam }),
		placeholderData: keepPreviousData,
	});
	return { result, isLoading };
}
