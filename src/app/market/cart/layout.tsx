import Navbar from "@/components/navbar";

export const metadata = {
  title: "Carrinho de Pedidos | Venda+",
  description:
    "Gerencie os produtos do seu carrinho de compras no Venda+ Supermercado",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
