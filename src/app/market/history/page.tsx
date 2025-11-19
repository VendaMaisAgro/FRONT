'use client'
import { notFound } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, ChevronDown, ShoppingCart } from 'lucide-react'
import OrderCard, { OrderView } from './components/OrderCard'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/utils/functions'
import type { SaleData, SaleBoughtProduct } from '@/types/types'

function resolveProductName(bp: SaleBoughtProduct): string {
  const n = bp.product?.name
  return n ? String(n) : `Produto #${bp.productId ?? ''}`.trim()
}

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'price-high' | 'price-low'>('recent')
  const [orders, setOrders] = useState<(OrderView & { createdAtISO: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
      ; (async () => {
        try {
          setLoading(true)
          const res = await fetch('/api/sale?mine=1', { cache: 'no-store', credentials: 'include', signal: controller.signal })
          if (res.status === 404) return notFound()
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const sales: SaleData[] = await res.json()

          const mapped: (OrderView & { createdAtISO: string })[] = sales.map((s) => {
            const items = (s.boughtProducts ?? []).map((bp) => ({
              productId: Number(bp.productId),
              name: resolveProductName(bp),
              quantityLabel: `${Number(bp.amount)} un`,
            }))

            // it.value já é o valor total (preço unitário * quantidade)
            const itemsTotal = (s.boughtProducts ?? []).reduce((acc, it) => acc + Number(it.value), 0)
            const total = Number((itemsTotal + Number(s.transportValue || 0)))

            const vendorLabel =
              s.boughtProducts?.[0]?.product?.sellerId != null || s.boughtProducts?.[0]?.product?.seller
                ? s.boughtProducts?.[0]?.product?.seller?.name ?? 'Vendedor desconhecido'
                : 'Vendedor desconhecido'

            return {
              id: s.id,
              dateLabel: formatDate(s.createdAt),
              createdAtISO: s.createdAt,
              total,
              deliveryDateLabel: s.arrivedAt ? formatDate(s.arrivedAt) : undefined,
              status: s.arrivedAt ? 'delivered' : 'pending',
              items,
              vendorLabel,
              paymentCompleted: s.paymentCompleted ?? false,
              paymentMethodId: s.paymentMethodId,
            }
          })

          setOrders(mapped)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e: unknown) {
          if (!controller.signal.aborted) setOrders([])
        } finally {
          if (!controller.signal.aborted) setLoading(false)
        }
      })()

    return () => controller.abort()
  }, [])

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase()
    const list = orders
      .filter((order) => {
        const matchVendor = (order.vendorLabel || '').toLowerCase().includes(term)
        const matchItem = order.items.some((item) => (item.name || '').toLowerCase().includes(term))
        return matchVendor || matchItem
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'oldest':
            return new Date(a.createdAtISO).getTime() - new Date(b.createdAtISO).getTime()
          case 'price-high':
            return b.total - a.total
          case 'price-low':
            return a.total - b.total
          case 'recent':
          default:
            return new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime()
        }
      })
    return list
  }, [orders, searchTerm, sortBy])

  const SkeletonHeader = (
    <div className="hidden md:block max-w-6xl mx-auto space-y-4 px-4 py-6">
      <Skeleton className="h-7 w-64" />
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <>
          {SkeletonHeader}
          <div className="md:max-w-6xl md:mx-auto md:px-4 space-y-3 md:space-y-4 pb-6 px-4">
            {[1, 2, 3].map(k => (
              <div key={k} className="bg-white md:rounded-lg md:border border-gray-200 md:shadow-sm p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1">
                    <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-28 ml-auto" />
                    <Skeleton className="h-9 w-32 ml-auto" />
                  </div>
                </div>
                <Skeleton className="h-4 w-40 mt-4" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="hidden md:block max-w-6xl mx-auto space-y-4 px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Histórico de pedidos</h1>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar todos os produtos"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Buscar pedidos por produto ou vendedor"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2" aria-haspopup="menu">
                    Filtrar e ordenar
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy('recent')}>Mais recente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('oldest')}>Mais antigo</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-high')}>Maior preço</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-low')}>Menor preço</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="md:max-w-6xl md:mx-auto md:px-4 space-y-3 md:space-y-4 pb-6">
            {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600 mb-3">Tente ajustar seus filtros ou termos de busca</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Limpar filtros</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}