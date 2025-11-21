import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderCardSkeleton() {
  return (
    <Card className="border-muted bg-white">
      <CardContent className="px-4 md:px-6">
        <div className="flex flex-col gap-4">
          {/* Número do pedido */}
          <Skeleton className="h-7 w-32" />

          {/* Grid de informações principais */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:items-center">
            <div className="col-span-2">
              <Skeleton className="h-5 w-full max-w-[180px]" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-5 w-full max-w-[200px]" />
            </div>
            <div className="col-span-2 flex items-center justify-between gap-3 md:justify-end">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Grid de valor e pagamento */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
            <div className="col-span-2">
              <Skeleton className="h-5 w-full max-w-[150px]" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-5 w-full max-w-[180px]" />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-3 md:flex-row">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

