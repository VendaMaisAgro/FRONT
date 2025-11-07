import { useQuery } from "@tanstack/react-query";

export default function useFetchCitiesFromUf(selectedUf: string) {
	const { data: cities, isLoading: isLoadingCities } = useQuery({
		queryKey: ["cities", selectedUf],
		queryFn: async () => {
			const res = await fetch(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`
			);
			if (!res.ok) return [];
			return res.json();
		},
		enabled: !!selectedUf,
	});

	return [cities, isLoadingCities];
}
