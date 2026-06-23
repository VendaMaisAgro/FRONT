"use client";

import { getSalesData, updateSaleStatus, updateSellerDecision } from "@/actions/sales";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, FileText } from "lucide-react";
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
import ContractTemplate, { ContractContextData } from "@/components/sale/ContractTemplate";
import { getContractView, acceptContract } from "@/actions/contract";
import {
	Calendar,
	ChevronDown,
	Hash,
	LoaderCircle,
	Plus,
	Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OrderCard } from "./OrderCard";
import { OrdersPageSkeleton } from "./OrdersPageSkeleton";
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
	// Criar string de produtos comprados (objetos aninhados podem não vir em produção)
	const productsString = (sale.boughtProducts ?? [])
		.map((bp) => {
			const unit = bp.sellingUnitProduct?.unit?.unit ?? bp.sellingUnitProduct?.unit?.title ?? "";
			const name = bp.product?.name ?? `Produto #${bp.productId}`;
			return unit ? `${bp.amount}${unit} ${name}` : `${bp.amount}x ${name}`;
		})
		.join(", ");

	// Calcular valor total (produtos + frete)
	const totalValue =
		(sale.boughtProducts ?? []).reduce((sum, bp) => sum + Number(bp.value), 0) +
		Number(sale.transportValue ?? 0);

	return {
		id: sale.id,
		orderNumber: sale.orderNumber,
		buyer: sale.buyer?.name ?? "Comprador",
		product: productsString || "—",
		value: totalValue,
		payment: sale.paymentMethod?.method ?? "",
		paymentCompleted: sale.paymentCompleted,
		status: statusMap[sale.status] || "new",
		action:
			sale.sellerApproved === true
				? "accepted"
				: sale.sellerApproved === false
					? "rejected"
					: null,
		cargoWeightKg: sale.cargoWeightKg || "",
		createdAt: sale.createdAt,
		decisionAt: sale.sellerApproved !== null && sale.sellerApproved !== undefined
			? (sale.sellerApprovedAt ?? sale.updatedAt)
			: undefined,
	};
}

export default function OrdersClient() {
	const [query, setQuery] = useState("");
	const [orders, setOrders] = useState<Order[]>([]);
	const [rawSales, setRawSales] = useState<SaleData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
	const [nextStatus, setNextStatus] = useState<OrderStatus>("processing");
	const [updateError, setUpdateError] = useState<string | null>(null);
	const [cargoWeight, setCargoWeight] = useState<string>("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [isAccepting, setIsAccepting] = useState(false);

	// Modal de termos (aceite antes de aceitar pedido)
	const [termsDialogOpen, setTermsDialogOpen] = useState(false);
	const [termsExpanded, setTermsExpanded] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [pendingAcceptOrderId, setPendingAcceptOrderId] = useState<string | null>(null);

	// Datas a preencher na aceitação
	const [plannedHarvestDate, setPlannedHarvestDate] = useState("");
	const [plannedPickupDate, setPlannedPickupDate] = useState("");
	const [plannedDeliveryDate, setPlannedDeliveryDate] = useState("");
	const [acceptDateError, setAcceptDateError] = useState<string | null>(null);

	// Dados do contrato carregados via getContractView ao abrir o diálogo de aceite
	const [acceptanceContractData, setAcceptanceContractData] = useState<ContractContextData | null>(null);
	const [acceptanceContractLoading, setAcceptanceContractLoading] = useState(false);

	// Carregar dados do backend
	useEffect(() => {
		async function loadSalesData() {
			try {
				setLoading(true);
				setError(null);
				const salesData = await getSalesData();
				const transformedOrders = salesData.sales.map(transformSaleDataToOrder);
				setOrders(transformedOrders);
				setRawSales(salesData.sales);
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
		return orders.filter((o) => String(o.orderNumber ?? o.id).includes(q));
	}, [orders, query]);

	const counters = useMemo(() => {
		const base = { new: 0, processing: 0, pickup: 0, completed: 0 } as Record<
			OrderStatus,
			number
		>;
		for (const o of orders) {
			if (o.action !== 'rejected') {
				base[o.status]++;
			}
		}
		return base;
	}, [orders]);

	function openStatusDialog(orderId: string, current: OrderStatus) {
		setSelectedOrderId(orderId);

		// Se o status atual for "new", definir como "processing" por padrão
		// caso contrário, usar o status atual
		setNextStatus(current === "new" ? "processing" : current);

		// Pré-preencher o peso da carga com o valor atual do pedido
		const order = orders.find(o => o.id === orderId);
		setCargoWeight(order?.cargoWeightKg || "");

		// Limpar erro anterior
		setUpdateError(null);

		setDialogOpen(true);
	}

	async function confirmStatusChange() {
		if (selectedOrderId == null) return;

		if (nextStatus === "pickup") {
			if (!cargoWeight.trim()) {
				setUpdateError("Por favor, informe o peso da carga.");
				return;
			}
			const weightValue = parseFloat(cargoWeight);
			if (isNaN(weightValue) || weightValue <= 0) {
				setUpdateError("O peso da carga deve ser maior que zero.");
				return;
			}
		}

		try {
			setIsUpdating(true);
			setUpdateError(null);

			const body: Record<string, unknown> = { status: reverseStatusMap[nextStatus] };
			if (nextStatus === "pickup" && cargoWeight.trim()) {
				body.cargoWeightKg = cargoWeight;
			}

			const response = await fetch(`/api/sales/${selectedOrderId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				let errData: { code?: string; message?: string } = {};
				try { errData = await response.json(); } catch { /* ignore */ }

				if (response.status === 409) {
					if (errData.code === "RESCHEDULE_BLOCKED_24H") {
						setUpdateError(
							"Faltam menos de 24h para a operação. Para reagendar, entre em contato com o suporte. Sujeito à multa de 10% conforme Cláusula 7."
						);
					} else if (errData.code === "RESCHEDULE_EXCEEDS_MAX_DAYS") {
						setUpdateError(
							"A nova data excede o limite de 3 dias úteis da data original contratada (Cláusula 9)."
						);
					} else {
						setUpdateError(errData.message ?? "Conflito ao atualizar o pedido. Tente novamente.");
					}
				} else {
					setUpdateError(errData.message ?? "Erro ao atualizar. Tente novamente.");
				}
				return;
			}

			setOrders((prev) =>
				prev.map((o) =>
					o.id === selectedOrderId
						? { ...o, status: nextStatus, cargoWeightKg: nextStatus === "pickup" ? cargoWeight : o.cargoWeightKg }
						: o
				)
			);
			setDialogOpen(false);
		} catch (error) {
			console.error("Erro ao atualizar:", error);
			setUpdateError("Erro ao atualizar. Tente novamente.");
		} finally {
			setIsUpdating(false);
		}
	}

	async function handleAcceptOrder(orderId: string) {
		setPendingAcceptOrderId(orderId);
		setTermsAccepted(false);
		setTermsExpanded(false);
		setPlannedHarvestDate("");
		setPlannedPickupDate("");
		setPlannedDeliveryDate("");
		setAcceptDateError(null);
		setAcceptanceContractData(null);
		setTermsDialogOpen(true);

		// Fetch contract context (same source as "Ver contrato") for data consistency
		try {
			setAcceptanceContractLoading(true);
			const sale = rawSales.find(s => s.id === orderId);
			const productId = sale?.boughtProducts?.[0]?.productId;
			const { contract, ok } = await getContractView(orderId, productId);
			if (ok) setAcceptanceContractData(contract as ContractContextData);
		} catch {
			// non-blocking: contract shows with saleData fallback
		} finally {
			setAcceptanceContractLoading(false);
		}
	}

	async function confirmAcceptWithTerms() {
		if (!termsAccepted || pendingAcceptOrderId == null) return;

		if (!plannedHarvestDate) {
			setAcceptDateError("Informe a data prevista de colheita/disponibilização.");
			return;
		}
		if (!plannedPickupDate) {
			setAcceptDateError("Informe a data prevista de retirada/embarque.");
			return;
		}

		try {
			setIsAccepting(true);
			setAcceptDateError(null);

			const dates = {
				plannedHarvestDate,
				plannedPickupDate,
				...(plannedDeliveryDate ? { plannedDeliveryDate } : {}),
			};

			// 1) Atualiza decisão do vendedor + datas no mesmo payload
			await updateSellerDecision(pendingAcceptOrderId, true, dates);

			// 2) Salva snapshot completo do contrato (item 2b)
			const conditions = {
				...((acceptanceContractData?.conditions as Record<string, unknown>) ?? {}),
				...dates,
			};
			await acceptContract({
				saleId: pendingAcceptOrderId,
				buyer:  acceptanceContractData?.buyer,
				seller: acceptanceContractData?.seller,
				items:  acceptanceContractData?.items as import("@/store/useCheckoutStore").ContractItem[] | undefined,
				conditions: conditions as import("@/store/useCheckoutStore").ContractConditions,
			}).catch((err) => console.error("[acceptContract]", err));

			// 3) Atualiza status para "Em processamento"
			await updateSaleStatus(pendingAcceptOrderId, reverseStatusMap["processing"]);

			// 4) Reflete no estado local
			setOrders((prev) =>
				prev.map((o) =>
					o.id === pendingAcceptOrderId
						? { ...o, action: "accepted", status: "processing" }
						: o
				)
			);
		} catch {
			setAcceptDateError("Erro ao confirmar pedido. Tente novamente.");
		} finally {
			setIsAccepting(false);
			setTermsDialogOpen(false);
			setPendingAcceptOrderId(null);
		}
	}

	async function handleRejectOrder(orderId: string) {
		await updateSellerDecision(orderId, false);
		setOrders((prev) =>
			prev.map((o) => (o.id === orderId ? { ...o, action: "rejected" } : o))
		);
	}

	if (loading) {
		return <OrdersPageSkeleton />;
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
						saleData={rawSales.find((s) => s.id === order.id)}
						onChangeStatus={() => openStatusDialog(order.id, order.status)}
						onAccept={() => handleAcceptOrder(order.id)}
						onReject={() => handleRejectOrder(order.id)}
					/>
				))}
			</div>

			<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialogContent className="max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle>Alterar status do pedido</AlertDialogTitle>
					</AlertDialogHeader>

					<div className="space-y-4 py-4">
						{/* Campo de seleção de status */}
						<div className="space-y-2">
							<label className="text-sm font-medium leading-none">
								Novo status <span className="text-red-500">*</span>
							</label>
							<Select
								value={nextStatus}
								onValueChange={(v) => setNextStatus(v as OrderStatus)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecione o status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="processing">Em processamento</SelectItem>
									<SelectItem value="pickup">Disponível para retirada</SelectItem>
									<SelectItem value="completed">Concluído</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Campo de peso da carga (condicional) */}
						{nextStatus === "pickup" && (
							<div className="space-y-2">
								<label htmlFor="cargoWeight" className="text-sm font-medium leading-none">
									Peso da carga (kg) <span className="text-red-500">*</span>
								</label>
								<Input
									id="cargoWeight"
									type="number"
									placeholder="Digite o peso em kg"
									value={cargoWeight}
									onChange={(e) => setCargoWeight(e.target.value)}
									className="w-full"
									min="0.01"
									step="0.01"
									required
								/>
							</div>
						)}

						{/* Mensagem de erro */}
						{updateError && (
							<p className="text-sm text-red-600">{updateError}</p>
						)}

						{/* Mensagem de confirmação */}
						<p className="text-sm text-muted-foreground">
							Tem certeza que deseja alterar o status deste pedido?
						</p>
					</div>

					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => setUpdateError(null)}
							disabled={isUpdating}
						>
							Cancelar
						</AlertDialogCancel>
						<Button
							onClick={confirmStatusChange}
							disabled={isUpdating}
						>
							{isUpdating ? (
								<>
									<LoaderCircle size={16} className="animate-spin mr-2" />
									Confirmando...
								</>
							) : (
								'Confirmar'
							)}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Modal de Termos de Venda para aceite de pedido */}
			<Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Termo de venda</DialogTitle>
					</DialogHeader>

					<Card className="border-2 border-gray-200">
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between pb-4 border-b">
									<div className="flex items-center gap-3">
										<FileText className="w-5 h-5 text-gray-600" />
										<span className="font-medium">Termo de venda - Venda+ Agromarket</span>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setTermsExpanded(!termsExpanded)}
										className="flex items-center gap-2"
									>
										{termsExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
										{termsExpanded ? "Ocultar" : "Visualizar"}
									</Button>
								</div>

								{termsExpanded && (
									<div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
										{acceptanceContractLoading ? (
											<div className="flex items-center gap-2 text-gray-500 py-6 justify-center">
												<LoaderCircle className="w-4 h-4 animate-spin" />
												Carregando contrato...
											</div>
										) : (
											<ContractTemplate
												key={`${pendingAcceptOrderId}-${plannedHarvestDate}-${plannedPickupDate}-${plannedDeliveryDate}`}
												mode="read-only"
												saleData={rawSales.find(s => s.id === pendingAcceptOrderId)}
												data={{
													...(acceptanceContractData ?? {}),
													conditions: {
														...((acceptanceContractData?.conditions as Record<string, unknown>) ?? {}),
														...(plannedHarvestDate  ? { plannedHarvestDate }  : {}),
														...(plannedPickupDate   ? { plannedPickupDate }   : {}),
														...(plannedDeliveryDate ? { plannedDeliveryDate } : {}),
													},
												}}
											/>
										)}
									</div>
								)}

								<div className="pt-4">
									<button
										type="button"
										onClick={() => {
											const sale = rawSales.find(s => s.id === pendingAcceptOrderId);
											if (sale) {
												sessionStorage.setItem("contractPreviewData", JSON.stringify({
													seller: { name: sale.boughtProducts[0]?.product?.seller?.name },
													buyer:  { name: sale.buyer?.name, cpf: sale.buyer?.cpf },
													products: sale.boughtProducts.map(bp => ({
														name: bp.product?.name,
														variety: bp.product?.variety,
														amount: Number(bp.amount),
														unit: bp.sellingUnitProduct?.unit?.unit ?? bp.sellingUnitProduct?.unit?.title ?? "un",
														unitPrice: Number(bp.amount) > 0 ? Number(bp.value) / Number(bp.amount) : Number(bp.value),
													})),
													paymentMethod: sale.paymentMethod?.method,
													total: sale.boughtProducts.reduce((s, bp) => s + Number(bp.value), 0) + Number(sale.transportValue ?? 0),
												}));
											}
											window.open(
												pendingAcceptOrderId
													? `/contrato/preview?saleId=${pendingAcceptOrderId}`
													: "/contrato/preview",
												"_blank"
											);
										}}
										className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 underline text-sm"
									>
										<FileText className="w-4 h-4" />
										Abrir documento completo (PDF)
									</button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Datas obrigatórias de confirmação */}
					<div className="mt-6 space-y-4 p-4 border rounded-lg bg-gray-50">
						<p className="text-sm font-semibold text-gray-800">Datas acordadas <span className="text-red-500">*</span></p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-1">
								<label className="text-sm font-medium">
									Colheita / Disponibilização <span className="text-red-500">*</span>
								</label>
								<Input
									type="date"
									value={plannedHarvestDate}
									onChange={(e) => { setPlannedHarvestDate(e.target.value); setAcceptDateError(null); }}
								/>
							</div>
							<div className="space-y-1">
								<label className="text-sm font-medium">
									Retirada / Embarque <span className="text-red-500">*</span>
								</label>
								<Input
									type="date"
									value={plannedPickupDate}
									onChange={(e) => { setPlannedPickupDate(e.target.value); setAcceptDateError(null); }}
								/>
							</div>
						</div>

						<div className="space-y-1">
							<label className="text-sm font-medium">
								Entrega no destino
							</label>
							<Input
								type="date"
								value={plannedDeliveryDate}
								onChange={(e) => setPlannedDeliveryDate(e.target.value)}
							/>
							<p className="text-xs text-gray-500">Obrigatório apenas se o transporte não for retirada no local.</p>
						</div>

						{acceptDateError && (
							<p className="text-sm text-red-600">{acceptDateError}</p>
						)}
					</div>

					<div className="flex flex-row items-start space-y-0 space-x-3 p-4 bg-green-50 rounded-lg border mt-6">
						<Checkbox checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} className="mt-1" />
						<div className="space-y-1 leading-none">
							<label className="text-sm font-medium leading-relaxed">
								Li e estou de acordo com o <span className="text-green-600 underline">Termo de Venda</span>.
								<span className="text-red-500 ml-1">*</span>
							</label>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setTermsDialogOpen(false)} disabled={isAccepting}>Cancelar</Button>
						<Button onClick={confirmAcceptWithTerms} disabled={!termsAccepted || isAccepting}>
							{isAccepting ? (
								<>
									<LoaderCircle size={16} className="animate-spin mr-2" />
									Confirmando...
								</>
							) : (
								"Confirmar"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
