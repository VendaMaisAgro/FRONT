import { getExecutiveOverview } from "@/actions/dashboard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export type ExecutiveOverviewFilters = {
	produto?: string;
	comprador?: string;
	vendedor?: string;
};

export default function useFetchExecutiveOverview(filters: ExecutiveOverviewFilters = {}) {
	const { produto, comprador, vendedor } = filters;

	const { data: result, isLoading } = useQuery({
		queryKey: ["executive-overview", produto, comprador, vendedor],
		queryFn: () => getExecutiveOverview({ produto, comprador, vendedor }),
		placeholderData: keepPreviousData,
	});
	return { result, isLoading };
}
