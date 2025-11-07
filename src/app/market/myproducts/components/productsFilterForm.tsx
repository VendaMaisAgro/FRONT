import Link from "next/link";
import { SortFilter } from "./sortFilter";

export default function ProductsFilterForm() {
  return (
    <form className="flex justify-between mb-6">
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Buscar todos os produtos"
          className="w-full p-2 pl-8 border rounded-md"
        />
        <svg
          className="absolute left-2 top-3 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <SortFilter />
      <Link href="/market/create-product">
        <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Cadastrar Produto
        </button>
      </Link>
    </form>
  );
}
