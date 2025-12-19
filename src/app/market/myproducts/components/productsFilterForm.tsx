import Link from "next/link";
import { SortFilter } from "./sortFilter";

export default function ProductsFilterForm() {
  return (
    <form className="flex flex-col md:flex-row justify-between mb-6 gap-3">
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="Buscar produto"
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
      <div className="flex gap-2 w-full md:w-auto">
        <div className="w-1/2 md:w-auto">
          <SortFilter />
        </div>
        <Link href="/market/create-product" className="w-1/2 md:w-auto">
          <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 w-full md:w-auto h-10">
            Cadastrar Produto
          </button>
        </Link>
      </div>
    </form>
  );
}
