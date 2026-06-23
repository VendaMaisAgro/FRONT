"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/utils/functions";
import type { SaleData } from "@/types/types";
import {
    Package,
    User,
    MapPin,
    CreditCard,
    Truck,
    Hash,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";

const statusLabel: Record<string, string> = {
    "Pedido realizado!": "Novo",
    "Em processamento": "Em processamento",
    "Disponível para retirada": "Pronto para retirada",
    "Concluído": "Concluído",
};

const statusColor: Record<string, string> = {
    "Pedido realizado!": "bg-gray-100 text-gray-800",
    "Em processamento": "bg-blue-100 text-blue-800",
    "Disponível para retirada": "bg-yellow-100 text-yellow-800",
    "Concluído": "bg-green-100 text-green-800",
};

function formatDate(iso: string | null | undefined) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface Props {
    saleId: string;
    saleData?: SaleData;
    showSeller?: boolean;
}

export default function SaleDetailClient({ saleId, saleData: initialData, showSeller = false }: Props) {
    const [sale, setSale] = useState<SaleData | null>(initialData ?? null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setSale(initialData);
            setLoading(false);
            return;
        }
        if (!saleId) return;
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                setSale(null);
                const res = await fetch(`/api/sale/${saleId}`, { credentials: "include" });
                if (!res.ok) {
                    const d = await res.json().catch(() => ({}));
                    throw new Error(d.error ?? "Erro ao carregar pedido");
                }
                const { data } = await res.json();
                if (!cancelled) setSale(data);
            } catch (e: unknown) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Erro ao carregar pedido");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [saleId, initialData]);

    if (loading) {
        return (
            <div className="space-y-4 p-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (error || !sale) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm text-red-600">{error ?? "Pedido não encontrado"}</p>
            </div>
        );
    }

    const productsTotal = (sale.boughtProducts ?? []).reduce(
        (sum, bp) => sum + Number(bp.value),
        0
    );
    const freight = Number(sale.transportValue ?? 0);
    const total = productsTotal + freight;

    const sellerApprovedLabel =
        sale.sellerApproved === true
            ? "Aceito"
            : sale.sellerApproved === false
            ? "Recusado"
            : "Aguardando confirmação";

    return (
        <div className="space-y-5">
            {/* Identificação e status */}
            <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-green-600" />
                    Pedido {sale.orderNumber ? `#${sale.orderNumber}` : sale.id.substring(0, 8)}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Realizado em {formatDate(sale.createdAt)}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                    <Badge className={statusColor[sale.status] ?? "bg-gray-100 text-gray-800"}>
                        {statusLabel[sale.status] ?? sale.status}
                    </Badge>
                    <Badge
                        className={
                            sale.sellerApproved === true
                                ? "bg-green-100 text-green-800"
                                : sale.sellerApproved === false
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-700"
                        }
                    >
                        {sale.sellerApproved === true ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                        ) : sale.sellerApproved === false ? (
                            <XCircle className="w-3 h-3 mr-1" />
                        ) : (
                            <Clock className="w-3 h-3 mr-1" />
                        )}
                        {sellerApprovedLabel}
                    </Badge>
                    {sale.paymentCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" /> Pago
                        </Badge>
                    )}
                </div>
            </div>

            <Separator />

            {/* Comprador ou Vendedor */}
            {showSeller ? (() => {
                const seller = sale.boughtProducts?.[0]?.product?.seller;
                return (
                    <Card className="shadow-none border-gray-100">
                        <CardHeader className="pb-2 pt-4 px-4">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <User className="w-4 h-4 text-green-600" /> Vendedor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-1 text-sm">
                            <p><span className="text-gray-500">Nome:</span> <span className="font-medium">{seller?.name ?? "—"}</span></p>
                            <p><span className="text-gray-500">E-mail:</span> {seller?.email ?? "—"}</p>
                            <p><span className="text-gray-500">Telefone:</span> {seller?.phone_number ?? "—"}</p>
                        </CardContent>
                    </Card>
                );
            })() : (
                <Card className="shadow-none border-gray-100">
                    <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-green-600" /> Comprador
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-1 text-sm">
                        <p><span className="text-gray-500">Nome:</span> <span className="font-medium">{sale.buyer?.name ?? "—"}</span></p>
                        <p><span className="text-gray-500">E-mail:</span> {sale.buyer?.email ?? "—"}</p>
                        <p><span className="text-gray-500">Telefone:</span> {sale.buyer?.phone_number ?? "—"}</p>
                    </CardContent>
                </Card>
            )}

            {/* Produtos */}
            <Card className="shadow-none border-gray-100">
                <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" /> Produtos
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                    {(sale.boughtProducts ?? []).map((bp, i) => {
                        const unit =
                            bp.sellingUnitProduct?.unit?.unit ??
                            bp.sellingUnitProduct?.unit?.title ??
                            "un";
                        return (
                            <div key={i} className="flex justify-between items-start text-sm">
                                <div>
                                    <p className="font-medium">{bp.product?.name ?? `Produto #${bp.productId}`}</p>
                                    <p className="text-gray-500">{bp.amount} {unit}</p>
                                </div>
                                <p className="font-semibold">{currencyFormatter(Number(bp.value))}</p>
                            </div>
                        );
                    })}
                    {sale.packagingType && (
                        <p className="text-xs text-gray-500 pt-1 border-t">
                            Embalagem: <span className="font-medium text-gray-700">{sale.packagingType}</span>
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Transporte e Pagamento */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="shadow-none border-gray-100">
                    <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Truck className="w-4 h-4 text-green-600" /> Transporte
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-sm space-y-1">
                        <p><span className="text-gray-500">Tipo:</span> <span className="font-medium">{sale.transportType?.type ?? "—"}</span></p>
                        <p><span className="text-gray-500">Frete:</span> <span className="font-medium">{currencyFormatter(freight)}</span></p>
                        {sale.cargoWeightKg && (
                            <p><span className="text-gray-500">Peso:</span> <span className="font-medium">{sale.cargoWeightKg} kg</span></p>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-none border-gray-100">
                    <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-green-600" /> Pagamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-sm space-y-1">
                        <p><span className="text-gray-500">Método:</span> <span className="font-medium">{sale.paymentMethod?.method ?? "—"}</span></p>
                        <p>
                            <span className="text-gray-500">Situação:</span>{" "}
                            <span className={`font-medium ${sale.paymentCompleted ? "text-green-600" : "text-yellow-600"}`}>
                                {sale.paymentCompleted ? "Pago" : "Pendente"}
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Endereço */}
            {sale.shippingAddress && (
                <Card className="shadow-none border-gray-100">
                    <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" /> Endereço de entrega
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-sm space-y-1">
                        <p className="font-medium">{sale.shippingAddress.addressee}</p>
                        <p>
                            {sale.shippingAddress.street}, {sale.shippingAddress.number}
                            {sale.shippingAddress.complement ? ` — ${sale.shippingAddress.complement}` : ""}
                        </p>
                        <p>{sale.shippingAddress.city} – {sale.shippingAddress.uf}, CEP {sale.shippingAddress.cep}</p>
                        {sale.shippingAddress.phone_number_addressee && (
                            <p className="text-gray-500">{sale.shippingAddress.phone_number_addressee}</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Datas */}
            {(sale.shippedAt || sale.arrivedAt || sale.actualDeliveryDate) && (
                <Card className="shadow-none border-gray-100">
                    <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" /> Datas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-sm space-y-1">
                        {sale.shippedAt && (
                            <p><span className="text-gray-500">Enviado em:</span> <span className="font-medium">{formatDate(sale.shippedAt)}</span></p>
                        )}
                        {sale.arrivedAt && (
                            <p><span className="text-gray-500">Chegada prevista:</span> <span className="font-medium">{formatDate(sale.arrivedAt)}</span></p>
                        )}
                        {sale.actualDeliveryDate && (
                            <p><span className="text-gray-500">Entrega efetiva:</span> <span className="font-medium">{formatDate(sale.actualDeliveryDate)}</span></p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Resumo financeiro */}
            <Card className="shadow-none border-gray-100">
                <CardContent className="px-4 py-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{currencyFormatter(productsTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Frete</span>
                        <span>{currencyFormatter(freight)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-green-700">{currencyFormatter(total)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
