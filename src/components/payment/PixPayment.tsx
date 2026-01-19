"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PixPaymentResponse, PaymentSyncResponse } from "@/types/types";
import { useRouter } from "next/navigation";

interface PixPaymentProps {
    paymentData: PixPaymentResponse;
    onSuccess?: () => void;
}

export default function PixPayment({ paymentData, onSuccess }: PixPaymentProps) {
    const router = useRouter();
    const [status, setStatus] = useState<string>(paymentData.payment.status);
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const { qr_code, qr_code_base64, ticket_url, id: paymentId } = paymentData.payment;

    // Polling para verificar status
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const checkStatus = async () => {
            if (status === "completed" || status === "cancelled" || status === "failed") {
                return;
            }

            try {
                const res = await fetch(`/api/payment/sync/${paymentData.paymentId}`);
                const data: PaymentSyncResponse = await res.json();

                if (data.success && data.payment) {
                    setStatus(data.payment.status);

                    if (data.payment.status === "completed") {
                        toast.success("Pagamento confirmado!");
                        if (onSuccess) onSuccess();
                        // Recarregar a página para atualizar o estado do pedido
                        router.refresh();
                    }
                }
            } catch (error) {
                console.error("Erro ao verificar status:", error);
            }
        };

        // Verificar a cada 5 segundos
        if (status === "pending" || status === "action_required") {
            intervalId = setInterval(checkStatus, 5000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [status, paymentData.paymentId, onSuccess, router]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qr_code);
        toast.success("Código PIX copiado!");
    };

    const handleCancel = async () => {
        if (!confirm("Tem certeza que deseja cancelar este pagamento?")) return;

        try {
            setCancelling(true);
            const res = await fetch("/api/payment/cancel-pix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId: paymentData.paymentId }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("cancelled");
                toast.info("Pagamento cancelado.");
            } else {
                toast.error(data.error || "Erro ao cancelar pagamento");
            }
        } catch (error) {
            console.error("Erro ao cancelar:", error);
            toast.error("Erro ao cancelar pagamento");
        } finally {
            setCancelling(false);
        }
    };

    if (status === "completed") {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-green-800">Pagamento Confirmado!</h3>
                        <p className="text-green-700">Seu pedido está sendo processado.</p>
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

    if (status === "cancelled" || status === "failed") {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-red-800">Pagamento Cancelado</h3>
                        <p className="text-red-700">Este pagamento foi cancelado ou expirou.</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Pagamento via PIX</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    {/* QR Code Image */}
                    <div className="border-4 border-white shadow-lg rounded-lg overflow-hidden">
                        {qr_code_base64 ? (
                            <img
                                src={`data:image/jpeg;base64,${qr_code_base64}`}
                                alt="QR Code PIX"
                                className="w-64 h-64 object-contain"
                            />
                        ) : (
                            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                                QR Code indisponível
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-gray-700">Tempo para pagamento</p>
                        <p className="text-xs text-gray-500">O QR Code expira em 30 minutos</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block">
                        Pix Copia e Cola
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={qr_code}
                            className="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-50 text-gray-600 focus:outline-none"
                        />
                        <Button size="icon" variant="outline" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Aguardando confirmação do pagamento...
                    </div>

                    <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={handleCancel}
                        disabled={cancelling}
                    >
                        {cancelling ? "Cancelando..." : "Cancelar Pagamento"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
