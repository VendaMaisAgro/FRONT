'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { currencyFormatter } from '@/utils/functions'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Eye, MessageSquare, ShoppingCart, CreditCard, CheckCircle, Upload, FileText, LoaderCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isValidUUID } from '@/lib/validation'

import Image from 'next/image'
import SaleDetailClient from '@/components/sale/SaleDetailClient'
import ContractTemplate from '@/components/sale/ContractTemplate'
import { getContractView } from '@/actions/contract'
import type { SaleData } from '@/types/types'

export type OrderItemView = {
    productId: number
    name: string
    quantityLabel: string
    imageEmoji?: string
    imageUrl?: string
}

export type OrderView = {
    id: string
    orderNumber?: number
    dateLabel: string
    total: number
    deliveryDateLabel?: string
    actualDeliveryDate?: string
    status: 'delivered' | 'pending' | 'rejected' | 'ready' | 'received' | 'completed' | 'waiting' | 'preparing'
    statusLabel: string
    items: OrderItemView[]
    vendorLabel: string
    paymentCompleted: boolean
    paymentMethodId: string
    sellerApproved: boolean | null
}

function FirstItem({ name, quantityLabel }: { name: string; quantityLabel: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{quantityLabel}</p>
        </div>
    )
}

export default React.memo(function OrderCard({ order, saleData }: { order: OrderView; saleData?: SaleData }) {
    const first = order.items?.[0]
    const router = useRouter()

    // Sheet de detalhe
    const [detailOpen, setDetailOpen] = useState(false)

    // Canhoto NF upload
    const [uploadOpen, setUploadOpen] = useState(false)
    const [uploadUrl, setUploadUrl] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadDone, setUploadDone] = useState(false)
    const [actualDelivery, setActualDelivery] = useState(order.actualDeliveryDate ?? "")

    // Contrato
    const [contractOpen, setContractOpen] = useState(false)
    const [contractData, setContractData] = useState<Record<string, unknown> | null>(null)
    const [contractLoading, setContractLoading] = useState(false)
    const [contractError, setContractError] = useState<string | null>(null)

    const handlePayment = () => {
        if (isValidUUID(order.id)) {
            router.push(`/market/payment/${order.id}`)
        }
    }

    async function handleUploadCanhoto() {
        if (!uploadUrl.trim()) {
            setUploadError("Informe a URL do documento.")
            return
        }
        try {
            setIsUploading(true)
            setUploadError(null)
            const res = await fetch(`/api/sales/${order.id}/documents`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ docType: "canhoto_nf", url: uploadUrl }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error ?? "Erro ao enviar documento")
            }
            const data = await res.json().catch(() => ({}))
            if (data.actualDeliveryDate) setActualDelivery(data.actualDeliveryDate)
            setUploadDone(true)
            setUploadOpen(false)
        } catch (e: unknown) {
            setUploadError(e instanceof Error ? e.message : "Erro ao enviar documento")
        } finally {
            setIsUploading(false)
        }
    }

    async function handleViewContract() {
        setContractOpen(true)
        if (contractData !== null) return
        try {
            setContractLoading(true)
            setContractError(null)
            const productId = saleData?.boughtProducts?.[0]?.productId
            const { contract, ok, error } = await getContractView(order.id, productId)
            if (!ok) throw new Error(error ?? "Erro ao carregar contrato")
            setContractData(contract)
        } catch (e: unknown) {
            setContractError(e instanceof Error ? e.message : "Erro ao carregar contrato")
        } finally {
            setContractLoading(false)
        }
    }

    const canUploadCanhoto = order.status === 'ready' || order.status === 'preparing'

    return (
        <div className="bg-white md:rounded-lg md:border border-gray-200 md:shadow-sm">
            {/* Mobile */}
            <div className="md:hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{order.orderNumber ? <span className="font-medium text-green-700 mr-1">Pedido #{order.orderNumber}</span> : null}feito em {order.dateLabel}</p>
                        <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm">
                            Comprar novamente
                        </Button>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                            {order.items?.[0]?.imageUrl ? (
                                <Image
                                    src={order.items[0].imageUrl}
                                    alt={order.items[0].name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="text-2xl">{order.items?.[0]?.imageEmoji || '🛒'}</div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <Badge
                                variant="secondary"
                                className={`text-xs mb-2 ${order.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                    : order.status === 'ready'
                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                        : order.status === 'preparing'
                                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                            : order.status === 'waiting'
                                                ? 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                                : 'bg-green-100 text-green-800 hover:bg-green-100'
                                    }`}
                            >
                                {order.statusLabel}
                            </Badge>

                            {order.deliveryDateLabel && (
                                <p className="font-medium text-gray-900 text-sm mb-1">Entregue no dia {order.deliveryDateLabel}</p>
                            )}

                            {first && <FirstItem name={first.name} quantityLabel={first.quantityLabel} />}

                            <p className="text-sm font-semibold text-gray-900 mb-3">
                                Total {currencyFormatter(order.total)}
                            </p>

                            <div className="flex flex-col gap-2">
                                {order.paymentCompleted ? (
                                    <div className="flex items-center justify-center text-green-600 bg-green-50 px-3 py-2 rounded-md text-sm font-medium w-full">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Pagamento confirmado
                                    </div>
                                ) : order.sellerApproved === true ? (
                                    <Button
                                        onClick={handlePayment}
                                        className="bg-green-600 hover:bg-green-700 w-full text-sm h-9"
                                        size="sm"
                                    >
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Realizar pagamento
                                    </Button>
                                ) : order.status !== 'rejected' && (
                                    <div className="text-center text-xs text-gray-500 bg-gray-50 p-2 rounded border border-dashed border-gray-200">
                                        Aguardando aprovação para liberar pagamento
                                    </div>
                                )}
                                <Button
                                    className="bg-green-600 hover:bg-green-700 w-full text-sm h-9"
                                    size="sm"
                                    onClick={() => setDetailOpen(true)}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver compra
                                </Button>
                                {/* Confirmar entrega — habilitado futuramente */}
                                {/* {canUploadCanhoto && !uploadDone && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-sm h-9 gap-2 text-green-700 border-green-300"
                                        onClick={() => setUploadOpen(true)}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Confirmar entrega
                                    </Button>
                                )} */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-sm h-9 gap-2"
                                    onClick={handleViewContract}
                                >
                                    <FileText className="w-4 h-4" />
                                    Ver contrato
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex gap-4 flex-1">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl overflow-hidden relative">
                                {order.items?.[0]?.imageUrl ? (
                                    <Image
                                        src={order.items[0].imageUrl}
                                        alt={order.items[0].name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="text-3xl">{order.items?.[0]?.imageEmoji || '🛒'}</div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={
                                            order.status === 'rejected'
                                                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                                : order.status === 'ready'
                                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                                    : order.status === 'preparing'
                                                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                                        : order.status === 'waiting'
                                                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                                            : 'bg-green-100 text-green-800 hover:bg-green-100'
                                        }
                                    >
                                        {order.statusLabel}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    {order.deliveryDateLabel && <p className="font-medium text-gray-900">Chegou no dia {order.deliveryDateLabel}</p>}
                                    <p className="text-sm text-gray-600">{order.items?.[0]?.name}</p>
                                    <p className="text-sm text-gray-500">{order.items?.[0]?.quantityLabel}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-right space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{order.vendorLabel}</p>
                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 p-0 h-auto font-normal">
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Enviar mensagem ao vendedor
                                </Button>
                            </div>

                            <div className="flex gap-2 flex-wrap justify-end">
                                {order.paymentCompleted ? (
                                    <div className="flex items-center text-green-600 font-medium text-sm px-3 py-1.5 bg-green-50 rounded-md">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Pagamento confirmado
                                    </div>
                                ) : order.sellerApproved === true ? (
                                    <Button
                                        onClick={handlePayment}
                                        className="bg-green-600 hover:bg-green-700 gap-2"
                                        size="sm"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Realizar pagamento
                                    </Button>
                                ) : order.status !== 'rejected' && (
                                    <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded border border-dashed border-gray-200">
                                        Aguardando aprovação
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setDetailOpen(true)}
                                >
                                    <Eye className="w-4 h-4" />
                                    Ver compra
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700 gap-2" size="sm">
                                    <ShoppingCart className="w-4 h-4" />
                                    Comprar novamente
                                </Button>
                                {/* Canhoto NF movido para o vendedor (/market/orders) */}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{order.orderNumber ? <span className="font-medium text-green-700 mr-1">Pedido #{order.orderNumber}</span> : null}feito em {order.dateLabel}</p>
                        <div className="flex items-center gap-2">
                            {actualDelivery && (
                                <p className="text-xs text-gray-500">Entregue em {new Date(actualDelivery).toLocaleDateString("pt-BR")}</p>
                            )}
                            {/* Confirmar entrega — habilitado futuramente */}
                            {/* {canUploadCanhoto && !uploadDone && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-green-700 border-green-300"
                                    onClick={() => setUploadOpen(true)}
                                >
                                    <Upload className="w-4 h-4" />
                                    Confirmar entrega
                                </Button>
                            )} */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-gray-600"
                                onClick={handleViewContract}
                            >
                                <FileText className="w-4 h-4" />
                                Ver contrato
                            </Button>
                            <p className="font-semibold text-gray-900">Total {currencyFormatter(order.total)}</p>
                        </div>
                    </div>
                </CardContent>
            </div>

            {/* Sheet: resumo do pedido */}
            <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader className="mb-4">
                        <SheetTitle>Resumo do pedido</SheetTitle>
                    </SheetHeader>
                    <SaleDetailClient saleId={order.id} saleData={saleData} showSeller />
                </SheetContent>
            </Sheet>

            {/* Dialog: upload canhoto NF */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar entrega / Enviar canhoto da NF</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <p className="text-sm text-gray-600">
                            Insira a URL do canhoto assinado da Nota Fiscal. A data de entrega efetiva será registrada automaticamente.
                        </p>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">URL do documento <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="https://..."
                                value={uploadUrl}
                                onChange={(e) => { setUploadUrl(e.target.value); setUploadError(null); }}
                            />
                        </div>
                        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={isUploading}>Cancelar</Button>
                        <Button onClick={handleUploadCanhoto} disabled={isUploading} className="bg-green-600 hover:bg-green-700">
                            {isUploading ? (
                                <><LoaderCircle className="w-4 h-4 animate-spin mr-2" />Enviando...</>
                            ) : (
                                <><Upload className="w-4 h-4 mr-2" />Enviar</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog: visualizar contrato */}
            <Dialog open={contractOpen} onOpenChange={setContractOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Contrato do pedido #{order.orderNumber ?? order.id.substring(0, 8)}</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        {contractLoading && (
                            <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
                                <LoaderCircle className="w-5 h-5 animate-spin" />
                                Carregando contrato...
                            </div>
                        )}
                        {contractError && <p className="text-sm text-red-600 py-4">{contractError}</p>}
                        {contractData && !contractLoading && (
                            <ContractTemplate mode="read-only" data={contractData} saleData={saleData} />
                        )}
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(`/contrato/preview?saleId=${order.id}`, "_blank")}
                        >
                            <FileText className="w-4 h-4" />
                            Abrir PDF completo
                        </Button>
                        <Button variant="outline" onClick={() => setContractOpen(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
})
