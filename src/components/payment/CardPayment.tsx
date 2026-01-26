"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface CardPaymentProps {
    saleId: string;
    paymentMethodId: string;
    amount: number;
    email: string; // Necessário para identificação no MP se não tivermos CPF
    onSuccess?: () => void;
}

declare global {
    interface Window {
        MercadoPago: any;
    }
}

export default function CardPayment({ saleId, paymentMethodId, amount, email, onSuccess }: CardPaymentProps) {
    const router = useRouter();
    const [mp, setMp] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form states
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [docType, setDocType] = useState("CPF");
    const [docNumber, setDocNumber] = useState("");
    const [installments, setInstallments] = useState("1");
    const [issuerId, setIssuerId] = useState("");
    const [paymentMethodIdMp, setPaymentMethodIdMp] = useState(""); // visa, master, etc
    const [installmentsList, setInstallmentsList] = useState<any[]>([]);

    // Inicializar Mercado Pago
    const initMercadoPago = () => {
        console.log("Mercado Pago Script Loaded");
        if (window.MercadoPago) {
            const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
            console.log("Public Key configurada:", !!publicKey);

            if (!publicKey) {
                setError("Chave pública do Mercado Pago não configurada (NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY).");
                return;
            }

            try {
                const mpInstance = new window.MercadoPago(publicKey, {
                    locale: 'pt-BR'
                });
                setMp(mpInstance);
            } catch (e) {
                console.error("Erro ao inicializar MP:", e);
                setError("Erro ao inicializar o SDK do Mercado Pago.");
            }
        } else {
            console.error("window.MercadoPago não encontrado");
            setError("Falha ao carregar script do Mercado Pago.");
        }
    };

    // Verificar se o script já está carregado ao montar o componente
    useEffect(() => {
        if (window.MercadoPago && !mp) {
            initMercadoPago();
        }
    }, []);

    // Identificar bandeira do cartão ao digitar e buscar parcelas
    useEffect(() => {
        if (!mp || cardNumber.length < 6) return;

        const guessPaymentMethod = async () => {
            try {
                const bin = cardNumber.replace(/\s/g, '').substring(0, 6);
                const paymentMethods = await mp.getPaymentMethods({ bin });

                if (paymentMethods.results && paymentMethods.results.length > 0) {
                    const method = paymentMethods.results[0];
                    setPaymentMethodIdMp(method.id);
                    setIssuerId(method.issuer.id);

                    // Buscar parcelas disponíveis
                    const installmentsResponse = await mp.getInstallments({
                        amount: String(amount),
                        bin,
                        paymentTypeId: 'credit_card'
                    });

                    if (installmentsResponse.length > 0) {
                        setInstallmentsList(installmentsResponse[0].payer_costs);
                    }
                }
            } catch (e) {
                console.error("Erro ao identificar bandeira/parcelas:", e);
            }
        };

        const timeoutId = setTimeout(guessPaymentMethod, 500);
        return () => clearTimeout(timeoutId);
    }, [cardNumber, mp, amount]);

    const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(formatted.substring(0, 19)); // Max 16 digits + 3 spaces
    };

    const handleFormatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            setCardExpiry(`${value.substring(0, 2)}/${value.substring(2, 4)}`);
        } else {
            setCardExpiry(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mp) return;

        setProcessing(true);
        setError(null);

        try {
            // 1. Criar token do cartão
            const expiryParts = cardExpiry.split('/');
            const token = await mp.createCardToken({
                cardNumber: cardNumber.replace(/\s/g, ''),
                cardholderName: cardName,
                cardExpirationMonth: expiryParts[0],
                cardExpirationYear: `20${expiryParts[1]}`, // Assumindo formato MM/AA
                securityCode: cardCvv,
                identificationType: docType,
                identificationNumber: docNumber.replace(/\D/g, '')
            });

            if (!token || !token.id) {
                throw new Error("Não foi possível gerar o token do cartão. Verifique os dados.");
            }

            // 2. Enviar para o backend
            const payload = {
                saleId,
                paymentMethodId,
                amount,
                token: token.id,
                installments: Number(installments),
                paymentMethodType: "credit_card", // Assumindo crédito por enquanto
                cardPaymentMethodId: paymentMethodIdMp || "credit_card" // Fallback
            };

            const res = await fetch("/api/payment/card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao processar pagamento");
            }

            if (data.payment.status === "approved" || data.payment.status === "authorized") {
                setSuccess(true);
                toast.success("Pagamento aprovado!");
                if (onSuccess) onSuccess();
                setTimeout(() => router.push("/market/history"), 2000);
            } else if (data.payment.status === "in_process" || data.payment.status === "pending") {
                setSuccess(true);
                toast.info("Pagamento em processamento.");
                if (onSuccess) onSuccess();
                setTimeout(() => router.push("/market/history"), 2000);
            } else {
                setError(`Pagamento não aprovado. Status: ${data.payment.status_detail || data.payment.status}`);
            }

        } catch (err: any) {
            console.error("Erro no pagamento:", err);
            // Tentar extrair mensagem de erro do MP (geralmente vem em array 'cause')
            const msg = err.message || "Erro desconhecido ao processar pagamento";
            setError(msg);
        } finally {
            setProcessing(false);
        }
    };

    if (success) {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-green-800">Pagamento Realizado!</h3>
                        <p className="text-green-700">Sua compra foi processada com sucesso.</p>
                    </div>
                    <Button
                        onClick={() => router.push("/market/history")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Ver Meus Pedidos
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Script
                src="https://sdk.mercadopago.com/js/v2"
                onLoad={initMercadoPago}
                onError={() => setError("Erro ao carregar script do Mercado Pago")}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Pagamento com Cartão
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!mp ? (
                        error ? (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2 items-start">
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        ) : (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="sr-only">Carregando formulário de pagamento...</span>
                            </div>
                        )
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2 items-start">
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Número do Cartão</Label>
                                <Input
                                    id="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={handleFormatCardNumber}
                                    maxLength={19}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cardName">Nome do Titular</Label>
                                <Input
                                    id="cardName"
                                    placeholder="Como impresso no cartão"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardExpiry">Validade</Label>
                                    <Input
                                        id="cardExpiry"
                                        placeholder="MM/AA"
                                        value={cardExpiry}
                                        onChange={handleFormatExpiry}
                                        maxLength={5}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cardCvv">CVV</Label>
                                    <Input
                                        id="cardCvv"
                                        placeholder="123"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="docType">Tipo Doc.</Label>
                                    <Select value={docType} onValueChange={setDocType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CPF">CPF</SelectItem>
                                            <SelectItem value="CNPJ">CNPJ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="docNumber">Número do Documento</Label>
                                    <Input
                                        id="docNumber"
                                        placeholder="Apenas números"
                                        value={docNumber}
                                        onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="installments">Parcelas</Label>
                                <Select value={installments} onValueChange={setInstallments}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o parcelamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {installmentsList.length > 0 ? (
                                            installmentsList.map((cost, index) => (
                                                <SelectItem key={index} value={String(cost.installments)}>
                                                    {cost.recommended_message || `${cost.installments}x de R$ ${cost.installment_amount} (Total: R$ ${cost.total_amount})`}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="1">1x de R$ {amount.toFixed(2).replace('.', ',')} (À vista)</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 mt-4"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    `Pagar R$ ${amount.toFixed(2).replace('.', ',')}`
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
