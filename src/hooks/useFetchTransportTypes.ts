import { getAll } from '@/actions/transportTypes';
import { useQuery } from '@tanstack/react-query';

export default function useFetchTransportTypes() {
	const { data: transportTypes, isLoading: isTransportTypesLoading } = useQuery(
		{
			queryKey: ['transportTypes'],
			queryFn: getAll,
		}
	);
	return [transportTypes, isTransportTypesLoading];
}
