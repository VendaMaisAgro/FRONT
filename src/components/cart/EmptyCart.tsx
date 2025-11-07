import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <ShoppingCart size={64} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Seu carrinho está vazio</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Parece que você ainda não adicionou nenhum produto ao seu carrinho.
        Explore nossa variedade de produtos frescos e de qualidade!
      </p>
      <Link
        href="/market"
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg"
      >
        Explorar produtos
      </Link>
    </div>
  );
};

export default EmptyCart;
