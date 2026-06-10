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
			// Assuming updateSaleStatus expects number if ID is number, but here ID is string (UUID).
			// If backend expects number, we have a problem. But SaleData usually uses UUID strings.
			// Let's assume string is correct for UUIDs.
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

	function handleAcceptOrder(orderId: string) {
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

											{/* Cabeçalho com logo */}
											<div className="flex justify-center pb-4 border-b border-gray-300">
												<img src="/logo-venda-mais.png" alt="Venda+ Agromarket" className="h-16 object-contain" />
											</div>

											<h2 className="text-center font-bold text-sm leading-snug uppercase">
												Contrato de Prestação de Serviços de Intermediação e Compra e Venda de Hortifrutigranjeiros
											</h2>

											<h3 className="font-bold text-sm">ANEXO I – QUADRO RESUMO (QR)</h3>
											<p className="text-xs italic text-gray-500">Este Anexo é parte integrante e indissociável do Contrato de Prestação de Serviços de Intermediação.</p>

											<div className="space-y-1 text-sm">
												<p><strong>Número da Operação/Contrato:</strong> {orders.find(o => o.id === pendingAcceptOrderId)?.orderNumber ?? "_______________________________"}</p>
												<p><strong>Data de Emissão:</strong> ____/____/________</p>
												<p><strong>INTERMEDIADORA:</strong> VENDAMAIS AGROMARKET BRASIL INOVA SIMPLES (I.S), CNPJ 62.591.442/0001-07, proprietária e operadora da marca e plataforma digital VENDA+ AGROMARKET, com sede à Rua Joaquim Bispo dos Santos, 56 – Bairro Santo Antonio – Juazeiro – Bahia. CEP 48903-190.</p>
												<p><strong>VENDEDOR (Nome/Razão Social):</strong> _____________________________________________</p>
												<p><strong>CNPJ/CPF:</strong> _____________________________________________</p>
												<p><strong>Endereço/Origem:</strong> _____________________________________________</p>
												<p><strong>Produto/Variedade:</strong> _____________________________________________</p>
												<p><strong>Quantidade Total (Kg/Ton):</strong> _____________________________________________</p>
												<p><strong>Valor Unitário:</strong> R$ ___________________</p>
												<p><strong>Tipo de Embalagem:</strong> _____________________________________________</p>
												<p><strong>Perfil do Vendedor:</strong> PRODUTOR (   )   COOPERATIVA/ASSOCIAÇÃO/DISTRIBUIDOR (   )</p>
												<p><strong>COMPRADOR (Razão Social):</strong> _____________________________________________</p>
												<p><strong>CNPJ:</strong> _____________________________________________</p>
												<p><strong>Ficha Técnica:</strong> Conforme laudo ou especificação anexa.</p>
												<p><strong>Pesagem Obrigatória:</strong> SIM</p>
												<p><strong>Valor Total da Operação:</strong> R$ ___________________</p>
												<p><strong>Comissão de Intermediação (VENDAMAIS AGROMARKET):</strong> 5% do comprador e 3% do vendedor.</p>
												<p><strong>Condição de Pagamento:</strong> À Vista (   )   A Prazo (   )   Prazo: ______ dias</p>
												<p><strong>Data Prevista para Colheita/Disponibilização:</strong> ____/____/________</p>
												<p><strong>Data Prevista para Retirada/Embarque:</strong> ____/____/________</p>
												<p><strong>Data Prevista para Entrega no Destino:</strong> ____/____/________</p>
												<p><strong>Entrega efetiva do produto:</strong> ____/____/________</p>
											</div>

											<div className="space-y-3 text-sm leading-relaxed">

												<p><strong>Cláusula 1 – Do Objeto e Vinculação</strong></p>
												<p>O presente contrato tem por objeto a prestação de serviços de intermediação comercial digital por VENDAMAIS AGROMARKET, doravante denominada INTERMEDIADORA, visando a efetivação da compra e venda dos produtos hortifrutigranjeiros descritos no Anexo I entre o VENDEDOR e o COMPRADOR. O Anexo I é parte integrante deste contrato e, em caso de divergência entre os dados nele inseridos e o texto padrão das cláusulas, prevalecerão sempre os dados específicos do Anexo I.</p>

												<p><strong>Cláusula 2 – Da Intermediadora</strong></p>
												<p>A INTERMEDIADORA compromete-se a disponibilizar a plataforma digital para o acesso das partes, a formalização contratual, o processamento dos pagamentos por meio da Conta Escrow e a gestão documental da operação. A remuneração da INTERMEDIADORA será de 5% (cinco por cento) sobre o valor da operação, acrescido ao montante pago pelo COMPRADOR, e de 3% (três por cento) a ser deduzido do repasse ao VENDEDOR. Os valores de remuneração da INTERMEDIADORA serão lançados em Nota Fiscal de Serviço-NFS contra o COMPRADOR e VENDEDOR. A INTERMEDIADORA não detém a posse física dos produtos, atuando exclusivamente como facilitadora da transação comercial e financeira, não respondendo por vícios ocultos, salvo se comprovada falha em serviço de certificação contratado diretamente pela plataforma. Os percentuais remuneratórios poderão ser alterados a qualquer tempo pela INTERMEDIADORA, desde que com aviso prévio às partes com antecipação de 10 (dez) dias úteis.</p>

												<p><strong>Cláusula 3 – Das Obrigações das Partes</strong></p>
												<p>O COMPRADOR realiza o pagamento nos prazos ajustados, o transporte e o seguro da carga. O VENDEDOR emite Nota Fiscal idônea e garante a procedência lícita e sanitária dos produtos. Quando o VENDEDOR for Produtor Individual, a colheita, seleção e a embalagem são realizadas diretamente pelo COMPRADOR com supervisão do Certificador de Conformidade; quando o VENDEDOR for Cooperativa/Associação/Distribuidor, este entregará a mercadoria colhida, selecionada e embalada em conformidade com o ANEXO I.</p><p>O VENDEDOR compromete-se a emitir a Nota Fiscal idônea contra o COMPRADOR antes da saída da mercadoria e garantir a procedência lícita e sanitária dos bens. O COMPRADOR compromete-se a realizar o pagamento nos prazos estabelecidos, responsabilizar-se integralmente pelo transporte e seguro da carga, e conferir a mercadoria no ato do recebimento no destino, observando os prazos de manifestação previstos neste contrato.</p>

												<p><strong>Cláusula 4 – Da Dinâmica de Pesagem e Fluxo Documental</strong></p>
												<p>A pesagem é condição obrigatória para todas as operações, devendo ser realizada em balança certificada pelo INMETRO. O motorista responsável efetuará a pesagem inicial (tara) e entregará o comprovante ao VENDEDOR, que acompanhará a pesagem final (bruto). O VENDEDOR deverá realizar o upload legível dos tickets de pesagem e da(s) Nota Fiscal(is) na plataforma em até duas horas após o carregamento. O status da carga somente será alterado para "Em Trânsito" após validação sistêmica dos documentos, sendo que a ausência de upload impede o início da contagem dos prazos de disponibilização e sujeita o VENDEDOR a sanções administrativas.</p>

												<p><strong>Cláusula 5 – Da Entrega, Recebimento e Aceite</strong></p>
												<p>A entrega efetiva da mercadoria no destino será considerada na data prevista no Anexo I, acrescida de um dia útil. Sendo o frete/transporte de responsabilidade do COMPRADOR, eventual atraso superior a esse prazo, por motivo de força maior, deverá ser comunicado imediatamente na plataforma através de email ou whatsapp; na ausência de comunicação, a entrega será tida por realizada. O COMPRADOR terá 6 (seis) horas após a chegada da carga para manifestar recusa ou avaria; o silêncio implicará em aceite tácito, tornando a obrigação de pagamento ao VENDEDOR líquida e exigível.</p><p><strong>Parágrafo único</strong> – No ato da entrega prevista no Anexo I, o MOTORISTA e/ou COMPRADOR deverão, em até 6 (seis) horas, enviar ao canal oficial da INTERMEDIADORA o canhoto da Nota Fiscal contendo assinatura, data e hora e ressalvas, caso haja. A falta de envio nesse prazo, somada à ausência de comunicação de fato impeditivo, evidencia a realização da entrega e enseja o início dos efeitos de aceite e exigibilidade de pagamento previstos neste contrato.</p>

												<p><strong>Cláusula 6 – Do Pagamento e Conta Escrow</strong></p>
												<p>O pagamento será realizado pelo COMPRADOR conforme a modalidade escolhida no Anexo I – Quadro Resumo, mediante utilização obrigatória da Conta Escrow disponibilizada pela INTERMEDIADORA.</p><p><strong>6.1. Operações com Produtor Individual</strong></p><p>I – À vista: será exigido depósito integral (100%) do valor total da operação na Conta Escrow até 72 (setenta e duas) horas antes da data prevista para a colheita.</p><p>II – A prazo: será exigida entrada mínima de 30% do valor total em Conta Escrow, devendo o saldo ser quitado em até 20 (vinte) dias, contados do aceite expresso ou tácito da mercadoria.</p><p><strong>6.2. Operações com Cooperativa, Associação ou Distribuidor</strong></p><p>I – À vista: o COMPRADOR deverá realizar depósito mínimo entre 10% e 30% do valor total em Conta Escrow até 72 (setenta e duas) horas antes da colheita, conforme definido no QR. O saldo remanescente deverá ser quitado integralmente na pesagem final do veículo e emissão da Nota Fiscal.</p><p>II – A prazo: as parcelas terão seu vencimento iniciado na data do aceite, expresso ou tácito, seguindo o cronograma estabelecido no QR.</p><p><strong>6.3. Inadimplência</strong></p><p>O não pagamento na data de vencimento sujeitará o COMPRADOR a: (a) multa de 5% sobre o valor da obrigação; (b) juros de mora de 1% (um por cento) ao dia; (c) bloqueio imediato do cadastro na plataforma até integral regularização; e (d) possibilidade de negativação junto aos órgãos de proteção ao crédito.</p><p><strong>6.4. Operações com Embarque em Finais de Semana e Feriados</strong></p><p>Nas operações cuja data prevista para retirada/embarque descrita no Anexo I ocorra aos sábados, domingos ou feriados, o saldo remanescente da operação deverá ser integralmente depositado na Conta Escrow e quitado pelo COMPRADOR até as 20h (horário de Brasília) do dia útil imediatamente anterior.</p><p><strong>Parágrafo único:</strong> A ausência de confirmação do pagamento no prazo estipulado neste item autoriza o VENDEDOR a reter a mercadoria e impedir o carregamento, sendo que o carregamento só será realizado após a compensação e quitação integral, correndo por conta e risco exclusivos do COMPRADOR eventuais prejuízos, custos com diárias de frete, falso frete ou deterioração do produto decorrentes deste atraso.</p>

												<p><strong>Cláusula 7 – Da Retenção da Mercadoria</strong></p>
												<p>O VENDEDOR somente disponibilizará a mercadoria para coleta após confirmação, pela INTERMEDIADORA, do depósito em Conta Escrow e da presença do Certificador de Conformidade no local designado (se for o caso) ou conforme Termo de Aditamento. Na ausência dos requisitos, a mercadoria permanece retida até regularização.</p>

												<p><strong>Cláusula 8 – Do Certificador de Conformidade</strong></p>
												<p>A contratação de Certificador de Conformidade independente poderá ser obrigatória ou opcional, conforme indicado no Anexo I – Quadro Resumo. Para operações em que o VENDEDOR seja Produtor Individual, a contratação do Certificador será, como regra geral, obrigatória, salvo dispensa excepcional, devidamente acordada entre COMPRADOR e VENDEDOR mediante Aditamento Contratual firmado digitalmente na plataforma da INTERMEDIADORA. Para operações em que o VENDEDOR seja Cooperativa, Associação ou Distribuidor, a certificação será opcional, porém recomendável, exceto quando expressamente indicada como obrigatória no Anexo I.</p><p>Quando contratado, o Certificador será providenciado pelo COMPRADOR através da INTERMEDIADORA e terá como função auditar e certificar, no local de embarque, a conformidade dos produtos em relação às especificações técnicas e comerciais descritas no Anexo I. O custo deste serviço corresponderá a 1% (um por cento) do valor total da operação, respeitado o piso mínimo de R$ 200,00 (duzentos reais), sendo integralmente de responsabilidade do COMPRADOR. O laudo emitido pelo Certificador será documento essencial para a liberação dos valores retidos em Conta Escrow ao VENDEDOR.</p><p><strong>Parágrafo primeiro</strong> – Da dispensa excepcional para Produtor Individual: Caso o COMPRADOR e o VENDEDOR (Produtor Individual) optem, em caráter extraordinário, pela não contratação do Certificador de Conformidade, essa dispensa deverá ser formalizada por Aditamento Contratual, firmado digitalmente na plataforma da INTERMEDIADORA. Nessa hipótese, as partes reconhecem e concordam que a conferência da mercadoria será atestada no carregamento e que implicará ACEITE TÁCITO, sem direito a controvérsias futuras quanto à conformidade dos produtos.</p><p><strong>Parágrafo segundo</strong> – Da operação sem certificação: Quando se tratar de operação com Cooperativa/Associação/Distribuidor e o Certificador não tiver sido contratado, a conferência da mercadoria será realizada no destino final, seguindo padrão já definido neste contrato.</p><p><strong>Parágrafo terceiro</strong> – Da responsabilidade técnica: O Certificador de Conformidade responderá civilmente por eventuais prejuízos decorrentes de laudo emitido em desacordo com as especificações técnicas, sem prejuízo da responsabilidade primária do VENDEDOR quanto à qualidade dos produtos. Havendo contestação fundamentada, caberá à INTERMEDIADORA instaurar procedimento de mediação, podendo a parte prejudicada buscar ressarcimento diretamente contra o Certificador.</p><p><strong>Parágrafo quarto</strong> – Da deterioração ou risco iminente de perda: Em razão da natureza perecível dos hortifrutigranjeiros, na hipótese de divergência não solucionada nos prazos contratuais e ocorrendo deterioração ou risco iminente de perda da carga, esta será imediatamente destinada a: (i) doação social, quando própria para consumo humano; (ii) processamento industrial, quando tecnicamente viável; ou (iii) descarte sanitário, quando imprópria para consumo ou processamento. A destinação será realizada pela parte que detiver a posse física da carga, devendo documentar integralmente o destino final e os respectivos custos, mediante registro fotográfico, identificação do lote e apresentação de documentos legais de descarte, doação ou processamento.</p><p><strong>Parágrafo quinto</strong> – Da responsabilidade financeira: A responsabilidade financeira decorrente da destinação será atribuída à parte que tiver dado causa à não conformidade, conforme apuração realizada pela INTERMEDIADORA. Após a destinação final, o produto será considerado perdido, inexistindo possibilidade de restituição ou indenização além da imputação da responsabilidade prevista neste contrato.</p>

												<p><strong>Cláusula 9 – Do Aditamento Contratual</strong></p>
												<p>Qualquer condição ou ajuste não previsto neste instrumento poderá ser objeto de Aditamento Contratual, desde que formalizado exclusivamente pela plataforma da INTERMEDIADORA e assinado digitalmente pelas partes.</p><p>Os aditamentos passam a integrar este contrato para todos os fins, produzindo efeitos imediatos após sua validação.</p><p>Os aditamentos deverão ser registrados no mínimo 72 (setenta e duas) horas antes da execução da operação, para produzir seus fins jurídicos.</p>

												<p><strong>Cláusula 10 – Da Proteção de Dados (LGPD)</strong></p>
												<p>As partes se comprometem a cumprir integralmente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), responsabilizando-se pelo tratamento adequado das informações pessoais compartilhadas no âmbito deste contrato. As partes declaram ciência de que seus dados serão tratados conforme a Política de Privacidade da plataforma VENDAMAIS AGROMARKET, autorizando o compartilhamento das informações estritamente necessárias (como localização e contato) com o Certificador de Conformidade ou outros prestadores de serviço vinculados à operação, exclusivamente para execução da transação contratada.</p>

												<p><strong>Cláusula 11 – Disposições Finais e Foro</strong></p>
												<p>As partes reconhecem a validade da assinatura eletrônica aposta neste contrato via plataforma. Para dirimir quaisquer dúvidas oriundas deste instrumento, elegem o foro da comarca de Juazeiro, Estado da Bahia, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
											</div>

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
