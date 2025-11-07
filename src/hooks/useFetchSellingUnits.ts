import { getAllSellingUnits } from "@/actions/sellingUnit";
import { useQuery } from "@tanstack/react-query";

export default function useFetchSellingUnits() {
	const { data: sellingUnits, isLoading: isSellingUnitsLoading } = useQuery({
		queryKey: ["sellingUnits"],
		queryFn: getAllSellingUnits,
	});
	return [sellingUnits, isSellingUnitsLoading];
}
