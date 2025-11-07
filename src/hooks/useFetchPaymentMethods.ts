import { getAll } from '@/actions/paymentMethods';
import { useQuery } from '@tanstack/react-query';

export default function useFetchPaymentMethods() {
	const { data: paymentMethods, isLoading: isPaymentMethods } = useQuery({
		queryKey: ['transportTypes'],
		queryFn: getAll,
	});
	return [paymentMethods, isPaymentMethods];
}
