import { useQuery } from "@tanstack/react-query";

export interface ViaCepResponse {
	cep?: string;
	logradouro?: string;
	complemento?: string;
	bairro?: string;
	localidade?: string; // city
	uf?: string;
	ibge?: string;
	gia?: string;
	ddd?: string;
	siafi?: string;
	erro?: boolean;
}

export default function useFetchCep(cep: string | undefined) {
	const sanitizedCep = cep ?? "";
	const {
		data: cepData,
		isLoading: isLoadingCep,
		error: cepError,
	} = useQuery<ViaCepResponse>({
		queryKey: ["cep", sanitizedCep],
		queryFn: async () => {
			const res = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
			if (!res.ok) {
				throw new Error("Falha ao consultar o CEP");
			}
			return res.json();
		},
		enabled: sanitizedCep.length === 8,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});

	return [cepData, isLoadingCep, cepError] as const;
}
