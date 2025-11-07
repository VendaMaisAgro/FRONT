"use client";

import { getSalesData, updateSaleStatus } from "@/actions/sales";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Order, OrderStatus, SaleData } from "@/types/types";
import {
	Calendar,
	ChevronDown,
	Eye,
	Hash,
	Loader2,
	Plus,
	Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OrderCard } from "./OrderCard";
import { StatCard } from "./StatCard";

const statusMap: Record<string, OrderStatus> = {
	"Pedido realizado!": "new",
	"Em processamento": "processing",
	"Disponível para retirada": "pickup",
	Concluído: "completed",
};

// Mapeamento reverso: status do componente para status da API
const reverseStatusMap: Record<OrderStatus, string> = {
	new: "Pedido realizado!",
	processing: "Em processamento",
	pickup: "Disponível para retirada",
	completed: "Concluído",
};

// Função para transformar dados da API em formato de Order
function transformSaleDataToOrder(sale: SaleData): Order {
	// Criar string de produtos comprados
	const productsString = sale.boughtProducts
		.map(
			(bp) =>
				`${bp.amount}${bp.sellingUnitProduct.unit.unit} ${bp.product.name}`
		)
		.join(", ");

	// Calcular valor total (produtos + frete)
	const totalValue =
		sale.boughtProducts.reduce((sum, bp) => sum + bp.value, 0) +
		sale.transportValue;

	return {
		id: sale.id,
		buyer: sale.buyer.name,
		product: productsString,
		value: totalValue,
		payment: sale.paymentMethod.method,
		status: statusMap[sale.status] || "new",
		action: sale.paymentCompleted ? "accepted" : null,
	};
}

export default function OrdersClient() {
	const [query, setQuery] = useState("");
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
	const [nextStatus, setNextStatus] = useState<OrderStatus>("processing");
	const [updateError, setUpdateError] = useState<string | null>(null);

	// Carregar dados do backend
	useEffect(() => {
		async function loadSalesData() {
			try {
				setLoading(true);
				setError(null);
				const salesData = await getSalesData();
				const transformedOrders = salesData.sales.map(transformSaleDataToOrder);
				setOrders(transformedOrders);
			} catch (err) {
				console.error("Erro ao carregar dados de vendas:", err);
				setError("Erro ao carregar dados de vendas");
			} finally {
				setLoading(false);
			}
		}

		loadSalesData();
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim();
		if (!q) return orders;
		return orders.filter((o) => String(o.id).includes(q));
	}, [orders, query]);

	const counters = useMemo(() => {
		const base = { new: 0, processing: 0, pickup: 0, completed: 0 } as Record<
			OrderStatus,
			number
		>;
		for (const o of orders) base[o.status]++;
		return base;
	}, [orders]);

	function openStatusDialog(orderId: string, current: OrderStatus) {
		setSelectedOrderId(orderId);
		setNextStatus(current);
		setDialogOpen(true);
	}

	async function confirmStatusChange() {
		if (selectedOrderId == null) return;

		try {
			setUpdateError(null);
			// Atualizar no backend
			await updateSaleStatus(selectedOrderId, reverseStatusMap[nextStatus]);

			// Atualizar no estado local
			setOrders((prev) =>
				prev.map((o) =>
					o.id === selectedOrderId ? { ...o, status: nextStatus } : o
				)
			);
			setDialogOpen(false);
		} catch (error) {
			console.error("Erro ao atualizar status:", error);
			setUpdateError("Erro ao atualizar status. Tente novamente.");
		}
	}

	function handleAcceptOrder(orderId: string) {
		setOrders((prev) =>
			prev.map((o) => (o.id === orderId ? { ...o, action: "accepted" } : o))
		);
	}

	function handleRejectOrder(orderId: string) {
		setOrders((prev) =>
			prev.map((o) => (o.id === orderId ? { ...o, action: 'rejected' } : o))
		);
	}

	if (loading) {
		return (
			<div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
				<div className="flex items-center justify-center py-12">
					<div className="flex items-center gap-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span>Carregando pedidos...</span>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<p className="text-red-600 mb-4">{error}</p>
						<Button onClick={() => window.location.reload()}>
							Tentar novamente
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
			<h1 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">
				Gerenciamento de pedidos
			</h1>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Novos" value={counters.new} />
				<StatCard title="Em processamento" value={counters.processing} />
				<StatCard title="Disponíveis para retirada" value={counters.pickup} />
				<StatCard title="Concluídos" value={counters.completed} />
			</div>

			<div className="mt-6 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
				<div className="flex flex-1 items-center gap-3">
					<div className="relative w-full">
						<Input
							placeholder="Buscar por número de pedido"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full pl-8"
						/>
						<Search className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="gap-2">
								Filtrar por
								<ChevronDown className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem className="gap-2">
								<Calendar className="size-4" /> Por data
							</DropdownMenuItem>
							<DropdownMenuItem className="gap-2">
								<Hash className="size-4" /> Por pedido
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex space-x-4">
					<Link href="/market/create-product" className="w-full">
						<Button className="gap-2 w-full">
							<Plus className="size-4" />
							Criar novo produto
						</Button>
					</Link>

					<Link href="/market/myproducts" className="w-full">
						<Button className="gap-2 w-full">
							<Eye className="size-4" /> Ver Meus produtos
						</Button>
					</Link>
				</div>
			</div>

			<div className="mt-6 flex flex-col gap-4">
				{filtered.map((order) => (
					<OrderCard
						key={order.id}
						order={order}
						onChangeStatus={() => openStatusDialog(order.id, order.status)}
						onAccept={() => handleAcceptOrder(order.id)}
						onReject={() => handleRejectOrder(order.id)}
					/>
				))}
			</div>

			<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialogContent className="max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle>Alterar status</AlertDialogTitle>
					</AlertDialogHeader>
					<div className="mt-0">
						<Select
							value={nextStatus}
							onValueChange={(v) => setNextStatus(v as OrderStatus)}
						>
							<SelectTrigger className="w-56">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="new">Novo</SelectItem>
								<SelectItem value="processing">Em processamento</SelectItem>
								<SelectItem value="pickup">Disponível para retirada</SelectItem>
								<SelectItem value="completed">Concluído</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<p className="mt-0 text-sm text-muted-foreground">
						Tem certeza que deseja alterar o status desse pedido?
					</p>
					{updateError && (
						<p className="mt-2 text-sm text-red-600">{updateError}</p>
					)}
					<AlertDialogFooter className="mt-1">
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={confirmStatusChange}>
							Confirmar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
