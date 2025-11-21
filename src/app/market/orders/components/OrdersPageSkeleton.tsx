import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Eye, Plus, Search } from "lucide-react";
import Link from "next/link";
import { OrderCardSkeleton } from "./OrderCardSkeleton";
import { StatCard } from "./StatCard";

export function OrdersPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">
        Gerenciamento de pedidos
      </h1>

      {/* Cards de estatísticas com loading */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Novos" value={0} />
        <StatCard title="Em processamento" value={0} />
        <StatCard title="Disponíveis para retirada" value={0} />
        <StatCard title="Concluídos" value={0} />
      </div>

      {/* Barra de busca e filtros */}
      <div className="mt-6 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full">
            <Input
              placeholder="Buscar por número de pedido"
              disabled
              className="w-full pl-8"
            />
            <Search className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
          </div>
          <Button variant="outline" className="gap-2" disabled>
            Filtrar por
            <ChevronDown className="size-4" />
          </Button>
        </div>

        <div className="flex space-x-4">
          <Link href="/market/create-product" className="w-full">
            <Button className="gap-2 w-full">
              <Plus className="size-4" />
              Criar novo produto
            </Button>
          </Link>

          <Link href="/market/myproducts" className="w-full">
            <Button className="gap-2 w-full">
              <Eye className="size-4" /> Ver Meus produtos
            </Button>
          </Link>
        </div>
      </div>

      {/* Skeleton dos cards de pedidos */}
      <div className="mt-6 flex flex-col gap-4">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </div>
  );
}

