import Products from "./components/products";
import ProductsFilterForm from "./components/productsFilterForm";

export default function MeusProdutos() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Meus Produtos</h1>
      {/* Área de busca e filtro */}
      <ProductsFilterForm />
      {/* Grid de produtos */}
      <Products />
    </div>
  );
}
