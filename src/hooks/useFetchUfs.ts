import { useQuery } from "@tanstack/react-query";

export default function useFetchUfs() {
  const { data: ufs, isLoading: ufsLoading } = useQuery({
    queryKey: ["ufs"],
    queryFn: async () => {
      const res = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      );
      if (!res.ok) return [];
      return res.json();
    },
  });
  return [ufs, ufsLoading];
}
