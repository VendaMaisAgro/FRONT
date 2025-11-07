import Navbar from "@/components/navbar";

export const metadata = {
  title: "Editar Produto | Venda+",
  description: "Edite seus produtos para venda no Venda+ Supermercado",
};

export default function EditProductLayout({
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
