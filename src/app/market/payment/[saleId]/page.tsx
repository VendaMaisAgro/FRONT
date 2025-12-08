'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { currencyFormatter } from '@/utils/functions'
import { CreditCard, Loader2, AlertCircle } from 'lucide-react'
import type { SaleData } from '@/types/types'
import { isValidUUID, sanitizeString, isValidPaymentUrl, validatePaymentData } from '@/lib/validation'

export default function PaymentPage() {
	const params = useParams()
	const saleId = params?.saleId as string | undefined

	const [sale, setSale] = useState<SaleData | null>(null)
	const [loading, setLoading] = useState(true)
	const [processing, setProcessing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!saleId) {
			setError('ID do pedido não encontrado')
			setLoading(false)
			return
		}

		// Validar formato do UUID
		if (!isValidUUID(saleId)) {
			setError('ID do pedido inválido')
			setLoading(false)
			return
		}

		const fetchSale = async () => {
			try {
				setLoading(true)
				// Buscar todas as compras do usuário para obter dados completos (incluindo sellingUnitProduct.unit e product.seller)
				const res = await fetch('/api/sale?mine=1', {
					credentials: 'include',
					cache: 'no-store',
				})

				if (!res.ok) {
					if (res.status === 404) {
						setError('Pedido não encontrado')
					} else {
						setError('Erro ao carregar dados do pedido')
					}
					return
				}

				const sales: SaleData[] = await res.json()
				
				// Filtrar pelo saleId específico
				const saleData = sales.find((s) => s.id === saleId)

				if (!saleData) {
					setError('Pedido não encontrado')
					return
				}

				// Debug: verificar paymentMethodId
				console.log('PaymentMethodId recebido:', saleData.paymentMethodId, typeof saleData.paymentMethodId)

				// Verificar se o pagamento já foi realizado
				if (saleData.paymentCompleted) {
					setError('Este pedido já foi pago')
					return
				}

				// Verificar se paymentMethodId existe
				if (!saleData.paymentMethodId) {
					setError('Método de pagamento não encontrado no pedido')
					return
				}

				setSale(saleData)
			} catch (err) {
				console.error('Erro ao buscar pedido:', err)
				setError('Erro ao carregar dados do pedido')
			} finally {
				setLoading(false)
			}
		}

		fetchSale()
	}, [saleId])

	const handlePayment = async () => {
		if (!sale) return

		// Validações de segurança
		if (!sale.boughtProducts || sale.boughtProducts.length === 0) {
			setError('Pedido sem produtos')
			return
		}

		if (!sale.boughtProducts[0]?.productId) {
			setError('Dados do produto inválidos')
			return
		}

		try {
			setProcessing(true)
			setError(null)

			// Calcular totais
			// bp.value já é o valor total (preço unitário * quantidade)
			const totalProdutos = sale.boughtProducts.reduce(
				(acc, bp) => acc + Number(bp.value || 0),
				0
			)
			const quantidadeTotal = sale.boughtProducts.reduce(
				(acc, bp) => acc + Number(bp.amount || 0),
				0
			)
			const totalFrete = Number(sale.transportValue || 0)
			const totalGeral = totalProdutos + totalFrete
			const precoMedio = quantidadeTotal > 0 ? totalProdutos / quantidadeTotal : 0

			// Obter nome do vendedor e sanitizar
			const vendorName = sanitizeString(
				sale.boughtProducts[0]?.product?.seller?.name || 'Vendedor',
				50
			)

			// Preparar dados do pagamento
			const paymentMethodId = sale.paymentMethodId
			
			// Debug
			console.log('Preparando pagamento:', {
				saleId: sale.id,
				paymentMethodId: paymentMethodId,
				paymentMethodIdType: typeof paymentMethodId,
				productId: sale.boughtProducts[0]?.productId
			})

			if (!paymentMethodId) {
				setError('Método de pagamento não encontrado no pedido')
				setProcessing(false)
				return
			}

			const paymentData = {
				saleId: sale.id,
				paymentMethodId: String(paymentMethodId).trim(), // Garantir que é string e remover espaços
				productId: sale.boughtProducts[0].productId,
				title: sanitizeString(`Pedido ${sale.id.substring(0, 8)} - ${vendorName}`, 100),
				unit_price: precoMedio,
				quantity: quantidadeTotal,
				amount: totalGeral,
			}

			// Validar dados antes de enviar
			const validation = validatePaymentData(paymentData)
			if (!validation.valid) {
				console.error('Validação falhou:', validation.error, paymentData)
				setError(validation.error || 'Dados inválidos')
				setProcessing(false)
				return
			}

			// Criar preferência de pagamento via API route
			const res = await fetch('/api/payment/preference', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(paymentData),
			})

			const result = await res.json()

			if (!res.ok) {
				// Mensagens de erro mais específicas
				let errorMessage = 'Erro ao criar preferência de pagamento'
				
				if (result.message) {
					if (result.message.includes('UNAUTHORIZED')) {
						errorMessage = 'Erro de autenticação com o Mercado Pago. Verifique a configuração do token de acesso.'
					} else {
						errorMessage = result.message
					}
				} else if (result.error) {
					errorMessage = result.error
				}
				
				setError(errorMessage)
				return
			}

			// Validar e redirecionar para o Mercado Pago
			if (result.init_point) {
				// Validar URL antes de redirecionar
				if (isValidPaymentUrl(result.init_point)) {
					window.location.href = result.init_point
				} else {
					setError('URL de pagamento inválida')
				}
			} else {
				setError('URL de pagamento não foi retornada')
			}
		} catch (err: any) {
			console.error('Erro ao processar pagamento:', err)
			setError(err.message || 'Erro ao processar pagamento')
		} finally {
			setProcessing(false)
		}
	}

	if (loading) {
		return (
			<div className="py-8 px-4">
				<div className="max-w-4xl mx-auto space-y-6">
					{/* Header - não carrega */}
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Checkout de Pagamento</h1>
					</div>

					{/* Grid com os cards */}
					<div className="grid md:grid-cols-3 gap-6">
						{/* Resumo do Pedido - Skeleton */}
						<div className="md:col-span-2">
							<Card>
								<CardHeader>
									<CardTitle>Resumo do Pedido</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-5 w-48" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-4 w-20" />
										<div className="space-y-3">
											<div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
												<div className="flex-1 space-y-2">
													<Skeleton className="h-4 w-32" />
													<Skeleton className="h-3 w-24" />
												</div>
												<Skeleton className="h-4 w-16" />
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Resumo de Pagamento - Skeleton */}
						<div className="md:col-span-1">
							<Card className="sticky top-6">
								<CardHeader>
									<CardTitle>Resumo de Pagamento</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-3">
										<div className="flex justify-between">
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-4 w-20" />
										</div>
										<div className="flex justify-between">
											<Skeleton className="h-4 w-12" />
											<Skeleton className="h-4 w-20" />
										</div>
										<div className="pt-3 border-t">
											<div className="flex justify-between">
												<Skeleton className="h-5 w-12" />
												<Skeleton className="h-6 w-24" />
											</div>
										</div>
									</div>
									<div className="pt-4">
										<Skeleton className="h-12 w-full" />
									</div>
									<div className="pt-4 border-t">
										<Skeleton className="h-3 w-full" />
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (error && !sale) {
		return (
			<div className="py-8 px-4">
				<div className="max-w-4xl mx-auto space-y-6">
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
						<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
						<p className="text-sm text-red-800">{error}</p>
					</div>
				</div>
			</div>
		)
	}

	if (!sale) {
		return null
	}

	// Calcular totais
	// bp.value já é o valor total (preço unitário * quantidade)
	const totalProdutos = sale.boughtProducts.reduce(
		(acc, bp) => acc + Number(bp.value),
		0
	)
	const totalFrete = Number(sale.transportValue || 0)
	const totalGeral = totalProdutos + totalFrete

	const vendorName =
		sale.boughtProducts[0]?.product?.seller?.name || 'Vendedor desconhecido'

	return (
		<div className="py-8 px-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Checkout de Pagamento</h1>
				</div>

				{/* Erro */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
						<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
						<p className="text-sm text-red-800">{error}</p>
					</div>
				)}

				<div className="grid md:grid-cols-3 gap-6">
					{/* Resumo do Pedido */}
					<div className="md:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Resumo do Pedido</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">Vendedor</p>
									<p className="text-sm text-gray-900">{vendorName}</p>
								</div>

								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">Produtos</p>
									<div className="space-y-3">
										{sale.boughtProducts.map((bp, index) => (
											<div
												key={index}
												className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
											>
												<div className="flex-1">
													<p className="text-sm font-medium text-gray-900">
														{bp.product?.name || 'Produto'}
													</p>
													<p className="text-xs text-gray-500">
														{(() => {
															// Obter a unidade de venda do endpoint (unit.unit ou unit.title)
															const unit = bp.sellingUnitProduct?.unit?.unit || bp.sellingUnitProduct?.unit?.title || 'un'
															return `${bp.amount} ${unit}`
														})()}
													</p>
												</div>
												<p className="text-sm font-semibold text-gray-900">
													{currencyFormatter(Number(bp.value))}
												</p>
											</div>
										))}
									</div>
								</div>

								{sale.shippingAddress && (
									<div className="space-y-2 pt-4 border-t">
										<p className="text-sm font-medium text-gray-700">
											Endereço de Entrega
										</p>
										<div className="text-sm text-gray-600">
											<p>{sale.shippingAddress.street}, {sale.shippingAddress.number}</p>
											{sale.shippingAddress.complement && (
												<p>{sale.shippingAddress.complement}</p>
											)}
											<p>
												{sale.shippingAddress.city} - {sale.shippingAddress.uf}
											</p>
											<p>CEP: {sale.shippingAddress.cep}</p>
											<p>Destinatário: {sale.shippingAddress.addressee}</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Resumo de Pagamento */}
					<div className="md:col-span-1">
						<Card className="sticky top-6">
							<CardHeader>
								<CardTitle>Resumo de Pagamento</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Subtotal</span>
										<span className="text-gray-900 font-medium">
											{currencyFormatter(totalProdutos)}
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Frete</span>
										<span className="text-gray-900 font-medium">
											{currencyFormatter(totalFrete)}
										</span>
									</div>
									<div className="pt-3 border-t">
										<div className="flex justify-between">
											<span className="text-base font-semibold text-gray-900">Total</span>
											<span className="text-lg font-bold text-gray-900">
												{currencyFormatter(totalGeral)}
											</span>
										</div>
									</div>
								</div>

								<div className="pt-4">
									<Button
										onClick={handlePayment}
										disabled={processing || sale.paymentCompleted}
										className="w-full bg-green-600 hover:bg-green-700 gap-2"
										size="lg"
									>
										{processing ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												Processando...
											</>
										) : (
											<>
												<CreditCard className="w-4 h-4" />
												Finalizar compra
											</>
										)}
									</Button>
									{sale.paymentCompleted && (
										<p className="text-xs text-gray-500 mt-2 text-center">
											Este pedido já foi pago
										</p>
									)}
								</div>

								<div className="pt-4 border-t">
									<p className="text-xs text-gray-500 text-center">
										Você será redirecionado para a plataforma de pagamento para concluir seu pedido.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

