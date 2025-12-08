import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCcw, CheckCircle2, XCircle, Info } from "lucide-react";
import { moneyMask } from "@/utils/functions";
import { Order } from "@/types/types";
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

export function OrderCard({
  order,
  onChangeStatus,
  onAccept,
  onReject
}: {
  order: Order;
  onChangeStatus: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <Card className="border-muted bg-white">
      <CardContent className="px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="text-green-600 text-lg font-semibold">
            Pedido #{order.id}
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
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Button variant="outline" className="flex-1 gap-2">
              <Eye className="size-4" /> Ver detalhes
            </Button>
            {!order.action && (
              <>
                <Button
                  className="flex-1 gap-2"
                  onClick={onAccept}
                >
                  <CheckCircle2 className="size-4" /> Aceitar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                    >
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
  );
}


