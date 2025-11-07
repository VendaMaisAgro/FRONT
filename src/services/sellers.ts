export interface Producer {
  id: number;
  name: string;
  category: string;
  products: number[];
  badge: string;
  badgeDescription: string;
  sales: number;
  goodService: number;
  onTimeDelivery: number;
  statusLevel: string;
  // inclua outros campos retornados pelo back, se houver
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL; // "http://localhost:5000"

export async function fetchSeller(id: number): Promise<Producer | null> {
  try {
    const response = await fetch(`${API_BASE}/producers/${id}`);
    if (!response.ok) {
      console.error(`Erro ao buscar produtor ${id}: ${response.status} ${response.statusText}`);
      return null;
    }
    const data: Producer = await response.json();
    return data;
  } catch (err) {
    console.error("Erro de rede ao buscar produtor:", err);
    return null;
  }
}