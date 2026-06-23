import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, RefreshCcw, CheckCircle2, XCircle, Info, FileText, LoaderCircle, BadgeCheck, Clock, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { moneyMask } from "@/utils/functions";
import { Order, SaleData } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import SaleDetailClient from "@/components/sale/SaleDetailClient";
import ContractTemplate from "@/components/sale/ContractTemplate";
import { getContractView } from "@/actions/contract";

export function OrderCard({
  order,
  saleData,
  onChangeStatus,
  onAccept,
  onReject
}: {
  order: Order;
  saleData?: SaleData;
  onChangeStatus: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [contractOpen, setContractOpen] = useState(false);
  const [contractData, setContractData] = useState<Record<string, unknown> | null>(null);
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);

  const [canhotoOpen, setCanhotoOpen] = useState(false);
  const [canhotoUrl, setCanhotoUrl] = useState("");
  const [isUploadingCanhoto, setIsUploadingCanhoto] = useState(false);
  const [canhotoError, setCanhotoError] = useState<string | null>(null);
  const [canhotoDone, setCanhotoDone] = useState(false);

  async function handleUploadCanhoto() {
    if (!canhotoUrl.trim()) {
      setCanhotoError("Informe a URL do documento.");
      return;
    }
    try {
      setIsUploadingCanhoto(true);
      setCanhotoError(null);
      const res = await fetch(`/api/sales/${order.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ docType: "canhoto_nf", url: canhotoUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? "Erro ao enviar documento");
      }
      setCanhotoDone(true);
      setCanhotoOpen(false);
    } catch (e: unknown) {
      setCanhotoError(e instanceof Error ? e.message : "Erro ao enviar documento");
    } finally {
      setIsUploadingCanhoto(false);
    }
  }

  async function handleViewContract() {
    setContractOpen(true);
    if (contractData !== null) return;
    try {
      setContractLoading(true);
      setContractError(null);
      const productId = saleData?.boughtProducts?.[0]?.productId;
      const { contract, ok, error } = await getContractView(order.id, productId);
      if (!ok) throw new Error(error ?? "Erro ao carregar contrato");
      setContractData(contract);
    } catch (e: unknown) {
      setContractError(e instanceof Error ? e.message : "Erro ao carregar contrato");
    } finally {
      setContractLoading(false);
    }
  }

  return (
    <>
      <Card className="border-muted bg-white">
        <CardContent className="px-4 md:px-6">
          <div className="flex flex-col gap-4">
            <div className="text-green-600 text-lg font-semibold">
              Pedido #{order.orderNumber ?? order.id}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:items-center">
              <div className="col-span-2">
                <div className="text-sm leading-5">
                  <span className="text-muted-foreground">Comprador:</span>{" "}
                  <span className="font-medium">{order.buyer}</span>
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm leading-5">
                  <span className="text-muted-foreground">Produto:</span>{" "}
                  <span className="font-medium">{order.product}</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-3 md:justify-end">
                <div className="text-sm text-muted-foreground">Alterar Status:</div>
                {order.action === "accepted" ? (
                  <Button variant="outline" className="gap-2" onClick={onChangeStatus}>
                    <RefreshCcw className="size-4" /> Alterar status
                  </Button>
                ) : order.action === "rejected" ? (
                  <span className="text-xs text-muted-foreground">Pedido recusado</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Info className="size-3.5" /> Disponível após aceitar
                  </span>
                )}
              </div>
              <div className="col-span-2 md:col-start-5 flex items-center justify-end gap-2">
                <span className="text-sm text-muted-foreground">Status atual:</span>
                <span className={`font-medium text-sm ${order.action === 'rejected' ? 'text-red-600' : ''}`}>
                  {order.action === 'rejected' ? 'Recusado' : (
                    <>
                      {order.status === 'new' && 'Novo'}
                      {order.status === 'processing' && 'Processando'}
                      {order.status === 'pickup' && 'Pronto para retirada'}
                      {order.status === 'completed' && 'Concluído'}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
              <div className="col-span-2 text-sm">
                <span className="text-muted-foreground">Valor:</span>{" "}
                <span className="font-medium">{moneyMask(order.value)}</span>
              </div>
              <div className="col-span-2 text-sm">
                <span className="text-muted-foreground">Pagamento:</span>{" "}
                <span className="font-medium">{order.payment}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                {order.paymentCompleted ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Pagamento confirmado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700">
                    <Clock className="w-3.5 h-3.5" />
                    Aguardando pagamento
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              {order.createdAt && (
                <span>
                  Pedido realizado em:{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(order.createdAt).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </span>
              )}
              {order.decisionAt && (
                <span>
                  {order.action === "accepted" ? "Aceito em:" : "Cancelado em:"}{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(order.decisionAt).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => setSheetOpen(true)}
              >
                <Eye className="size-4" /> Ver detalhes
              </Button>

              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleViewContract}
              >
                <FileText className="size-4" /> Ver contrato
              </Button>

              {order.paymentCompleted && !canhotoDone && (
                <Button
                  variant="outline"
                  className="flex-1 gap-2 text-green-700 border-green-300 hover:bg-green-50"
                  onClick={() => setCanhotoOpen(true)}
                >
                  <Upload className="size-4" /> Canhoto NF
                </Button>
              )}
              {canhotoDone && (
                <span className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-2 text-green-700 text-sm font-medium h-10">
                  <BadgeCheck className="size-4" /> Canhoto enviado
                </span>
              )}

              {!order.action && (
                <>
                  <Button className="flex-1 gap-2" onClick={onAccept}>
                    <CheckCircle2 className="size-4" /> Aceitar
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1 gap-2">
                        <XCircle className="size-4" /> Recusar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Recusar Pedido</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja recusar este pedido? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={onReject} className="bg-red-600 hover:bg-red-700">
                          Confirmar Recusa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {order.action === "accepted" && (
                <div className="flex-1 flex items-center justify-center gap-2 rounded-md bg-green-50 px-4 py-2 text-green-700 border border-green-200 h-10">
                  <CheckCircle2 className="size-4" />
                  <span className="font-medium">Pedido Aceito</span>
                </div>
              )}

              {order.action === "rejected" && (
                <div className="flex-1 flex items-center justify-center gap-2 rounded-md bg-red-50 px-4 py-2 text-red-700 border border-red-200 h-10">
                  <XCircle className="size-4" />
                  <span className="font-medium">Pedido Recusado</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Resumo do pedido</SheetTitle>
          </SheetHeader>
          <SaleDetailClient saleId={order.id} saleData={saleData} />
        </SheetContent>
      </Sheet>

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
              <ContractTemplate
                mode={order.paymentCompleted ? "read-only" : "seller-edit"}
                data={contractData}
                saleData={saleData}
              />
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

      <Dialog open={canhotoOpen} onOpenChange={setCanhotoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Canhoto da NF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">
              Insira a URL do canhoto assinado da Nota Fiscal. A data de entrega efetiva será registrada automaticamente pelo sistema.
            </p>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                URL do documento <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="https://..."
                value={canhotoUrl}
                onChange={(e) => { setCanhotoUrl(e.target.value); setCanhotoError(null); }}
              />
            </div>
            {canhotoError && <p className="text-sm text-red-600">{canhotoError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCanhotoOpen(false)} disabled={isUploadingCanhoto}>
              Cancelar
            </Button>
            <Button onClick={handleUploadCanhoto} disabled={isUploadingCanhoto} className="bg-green-600 hover:bg-green-700">
              {isUploadingCanhoto ? (
                <><LoaderCircle className="w-4 h-4 animate-spin mr-2" />Enviando...</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />Enviar</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
