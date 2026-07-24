import { OrderStatus } from "@/types/types";

// Rótulos em PT — mesma redação usada em src/app/market/orders/components/OrderCard.tsx
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	new: "Novo",
	processing: "Em processamento",
	down_payment_confirmed: "Entrada confirmada",
	harvest_authorized: "Colheita autorizada",
	harvest_completed: "Colheita concluída",
	weighing: "Em pesagem",
	awaiting_final_payment: "Aguard. pag. final",
	pickup: "Disponível p/ entrega",
	completed: "Concluído",
	cancelled: "Cancelado",
};

// Mesma convenção de cor de src/app/market/history/components/OrderCard.tsx
// (verde = concluído, azul = em progresso, amarelo = aguardando, cinza = novo, vermelho = cancelado)
export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
	new: "bg-gray-100 text-gray-800 hover:bg-gray-100",
	processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
	down_payment_confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
	harvest_authorized: "bg-blue-100 text-blue-800 hover:bg-blue-100",
	harvest_completed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
	weighing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
	awaiting_final_payment: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
	pickup: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
	completed: "bg-green-100 text-green-800 hover:bg-green-100",
	cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};
