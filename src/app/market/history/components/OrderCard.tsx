'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { currencyFormatter } from '@/utils/functions'
import { Eye, MessageSquare, ShoppingCart } from 'lucide-react'
import React from 'react'
export type OrderItemView = {
    productId: number
    name: string
    quantityLabel: string
    imageEmoji?: string
}

export type OrderView = {
    id: string
    dateLabel: string
    total: number
    deliveryDateLabel?: string
    status: 'delivered' | 'pending'
    items: OrderItemView[]
    vendorLabel: string
}

function FirstItem({ name, quantityLabel }: { name: string; quantityLabel: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{quantityLabel}</p>
        </div>
    )
}

export default React.memo(function OrderCard({ order }: { order: OrderView }) {
    const first = order.items?.[0]

    return (
        <div className="bg-white md:rounded-lg md:border border-gray-200 md:shadow-sm">
            {/* Mobile */}
            <div className="md:hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Pedido feito em {order.dateLabel}</p>
                        <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm">
                            Comprar novamente
                        </Button>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <div className="text-2xl">{order.items?.[0]?.imageEmoji || '🛒'}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <Badge
                                variant="secondary"
                                className={`text-xs mb-2 ${order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                    }`}
                            >
                                {order.status === 'delivered' ? 'Entregue' : 'Em andamento'}
                            </Badge>

                            {order.deliveryDateLabel && (
                                <p className="font-medium text-gray-900 text-sm mb-1">Entregue no dia {order.deliveryDateLabel}</p>
                            )}

                            {first && <FirstItem name={first.name} quantityLabel={first.quantityLabel} />}

                            <p className="text-sm font-semibold text-gray-900 mb-3">
                                Total {currencyFormatter(order.total)}
                            </p>

                            <p className="text-sm font-semibold text-gray-900 mb-3">
                                Total R$ {order.total.toFixed(2).replace('.', ',')}
                            </p>

                            <Button className="bg-green-600 hover:bg-green-700 w-full text-sm h-9" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver compra
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex gap-4 flex-1">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                                {order.items?.[0]?.imageEmoji || '🛒'}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={
                                            order.status === 'delivered'
                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                        }
                                    >
                                        {order.status === 'delivered' ? 'Entregue' : 'Em andamento'}
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

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Eye className="w-4 h-4" />
                                    Ver compra
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700 gap-2" size="sm">
                                    <ShoppingCart className="w-4 h-4" />
                                    Comprar novamente
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">Pedido feito em {order.dateLabel}</p>
                        <p className="font-semibold text-gray-900">Total {currencyFormatter(order.total)}</p>
                    </div>
                </CardContent>
            </div>
        </div>
    )
})
