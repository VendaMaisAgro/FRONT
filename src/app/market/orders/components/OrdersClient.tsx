"use client";

import { getSalesData, updateSaleStatus, updateSellerDecision } from "@/actions/sales";
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
    action:
      sale.sellerApproved === true
        ? "accepted"
        : sale.sellerApproved === false
        ? "rejected"
        : null,
		cargoWeightKg: sale.cargoWeightKg || "",
	};
}

export default function OrdersClient() {
	const [query, setQuery] = useState("");
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
	const [nextStatus, setNextStatus] = useState<OrderStatus>("processing");
	const [updateError, setUpdateError] = useState<string | null>(null);
	const [cargoWeight, setCargoWeight] = useState<string>("");
	const [isUpdating, setIsUpdating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

	// Modal de termos (aceite antes de aceitar pedido)
	const [termsDialogOpen, setTermsDialogOpen] = useState(false);
	const [termsExpanded, setTermsExpanded] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [pendingAcceptOrderId, setPendingAcceptOrderId] = useState<number | null>(null);

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

	function openStatusDialog(orderId: number, current: OrderStatus) {
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

		// Validação: se o status for "pickup", o peso da carga é obrigatório e deve ser maior que zero
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
			
			// PASSO 1: Atualizar o status
			await updateSaleStatus(selectedOrderId, reverseStatusMap[nextStatus]);

			// PASSO 2: Se for "pickup" e tiver peso, atualizar o peso SEPARADAMENTE usando fetch client-side
			if (nextStatus === "pickup" && cargoWeight.trim()) {
				// Fazer requisição direto do client para forçar passar pela API route local
				const response = await fetch(`/api/sales/${selectedOrderId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ cargoWeightKg: cargoWeight }),
				});

				if (!response.ok) {
					throw new Error("Erro ao atualizar peso");
				}
			}

			// Atualizar no estado local
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

	function handleAcceptOrder(orderId: number) {
		setPendingAcceptOrderId(orderId);
		setTermsAccepted(false);
		setTermsExpanded(false);
		setTermsDialogOpen(true);
	}

  async function confirmAcceptWithTerms() {
    if (!termsAccepted || pendingAcceptOrderId == null) return;
    try {
      setIsAccepting(true);
      // 1) Atualiza decisão do vendedor
      await updateSellerDecision(pendingAcceptOrderId, true);
      // 2) Atualiza status para "Em processamento"
      await updateSaleStatus(pendingAcceptOrderId, reverseStatusMap["processing"]);
      // 3) Reflete no estado local
      setOrders((prev) =>
        prev.map((o) =>
          o.id === pendingAcceptOrderId
            ? { ...o, action: "accepted", status: "processing" }
            : o
        )
      );
    } finally {
      setIsAccepting(false);
      setTermsDialogOpen(false);
      setPendingAcceptOrderId(null);
    }
  }

  async function handleRejectOrder(orderId: number) {
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
										<div className="prose prose-sm max-w-none text-gray-700 space-y-4">
											<p className="text-sm leading-relaxed">
												<strong>LGPD (Lei Geral de Proteção de Dados)</strong><br />
												A Lei Geral de Proteção de Dados (LGPD - Lei 13.709/18) é a legislação brasileira que regula as atividades de tratamento de dados pessoais e que também altera os artigos 7º e 16 do Marco Civil da Internet. A principal intenção da lei é proteger os direitos fundamentais de liberdade e de privacidade e a livre formação da personalidade de cada indivíduo. A LGPD se aplica a qualquer operação de tratamento realizada por pessoa física ou por pessoa jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados.
											</p>

											<p className="text-sm leading-relaxed">
												Para compreender a aplicação da LGPD é preciso conhecer alguns conceitos importantes. Em primeiro lugar, o que são dados pessoais? A LGPD considera dados pessoais toda informação relacionada a pessoa natural identificada ou identificável. Além dos dados pessoais, existe uma outra categoria que demanda ainda maior proteção: os dados pessoais sensíveis.
											</p>

											<p className="text-sm leading-relaxed">
												<strong>Dados pessoais sensíveis:</strong> são informações sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.
											</p>

											<p className="text-sm leading-relaxed">
												<strong>Dados pessoais:</strong> são todas informações relacionadas a uma pessoa natural que possa identificá-la. Ainda, os dados pessoais podem ser dados pessoais sensíveis, esses são todas informações sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.
											</p>

											<p className="text-sm leading-relaxed font-semibold">
												É importante pontuar que:
											</p>

											<ul className="text-sm space-y-2 ml-4">
												<li>• <strong>Política de Privacidade</strong> se refere a informações específicas de coleta, armazenamento e proteção de dados pessoas de usuários de um site ou aplicativo.</li>
												<li>• <strong>Termos e Condições Gerais de Uso</strong> servem para indicar as regras que devem ser respeitadas ao utilizar a plataforma. Ou seja, informam as obrigações e direitos dos usuários como também da plataforma, visto que o mesmo serve como uma espécie de contrato de adesão.</li>
											</ul>

											<p className="text-sm leading-relaxed">
												Assim, compreendendo essa diferença, caso o contrato que se encaixe em sua situação seja o Termos e Condições Gerais de Uso, indicamos que você consulte nosso modelo: <span className="text-green-600 underline">Termos e Condições de Uso</span>.
											</p>
										</div>
									</div>
								)}

								<div className="pt-4">
									<a
										href="/termo-de-venda.pdf"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 underline text-sm"
									>
										<FileText className="w-4 h-4" />
										Abrir documento completo (PDF)
									</a>
								</div>
							</div>
						</CardContent>
					</Card>

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
