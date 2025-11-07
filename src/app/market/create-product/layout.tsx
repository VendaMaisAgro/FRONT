import Navbar from "@/components/navbar";

export const metadata = {
  title: "Cadastrar Produto | Venda+",
  description: "Cadastrar seus produtos para venda no Venda+ Supermercado",
};

export default function CreateProductLayout({
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
