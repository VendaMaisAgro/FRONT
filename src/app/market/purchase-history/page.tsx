import Navbar from "@/components/navbar";
import { Search } from "lucide-react";
import Image from "next/image";

export default function HistoricoDeCompras() {
  const pedidos = [
    {
      dataPedido: "15 de janeiro",
      total: "R$ 30,40",
      status: "Entregue",
      dataEntrega: "20 de janeiro",
      produto: "Melancia",
      quantidade: "200 unidades",
      fornecedor: "FAZENDA DOCE FRUTAS",
      imagem: "/melancia.png",
    },
    {
      dataPedido: "15 de janeiro",
      total: "R$ 52,56",
      status: "Entregue",
      dataEntrega: "19 de janeiro",
      produto: "Laranja",
      quantidade: "50 sacos",
      fornecedor: "FRUTAS DA SERRA",
      imagem: "/laranja.png",
    },
    {
      dataPedido: "12 de janeiro",
      total: "R$ 21,00",
      status: "Entregue",
      dataEntrega: "16 de janeiro",
      produto: "Manga Tommy",
      quantidade: "200 unidades",
      fornecedor: "NATURALIS FRUTAS",
      imagem: "/manga.png",
    },
    {
      dataPedido: "15 de janeiro",
      total: "R$ 50,31",
      status: "Entregue",
      dataEntrega: "19 de janeiro",
      produto: "Banana",
      quantidade: "300 unidades",
      fornecedor: "FAZENDA BANANAL",
      imagem: "/banana.png",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-background p-8 bg-neutral-100 min-h-screen font-inter">
        <h1 className="text-2xl font-bold mb-6">Histórico de compras</h1>

        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar todos os produtos"
              className="w-full pr-10 p-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 shadow-sm"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary hover:bg-sucess text-white p-2 rounded-md flex items-center justify-center"
              aria-label="Buscar"
            >
              <Search size={16} />
            </button>
          </div>

          <select className="w-44 p-2.5 rounded-lg border border-gray-300 text-sm bg-gray-200">
            <option>Ordenar por data</option>
            <option>Status</option>
            <option>Vendedor</option>
          </select>
        </div>

        {pedidos.map((pedido, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
          >
            <div className="flex gap-8 text-sm text-black mb-4">
              <span>Pedido feito em {pedido.dataPedido}</span>
              <span>Total {pedido.total}</span>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Image
                src={pedido.imagem}
                alt={pedido.produto}
                width={100}
                height={100}
                className=""
              />

              <div className="min-w-[150px]">
                <span className="text-primary font-bold block">
                  {pedido.status}
                </span>
                <strong>Chegou no dia {pedido.dataEntrega}</strong>
                <div>{pedido.produto}</div>
                <div>{pedido.quantidade}</div>
              </div>

              <div className="flex-1 min-w-[160px] text-center flex flex-col items-center">
                <span className="font-medium">{pedido.fornecedor}</span>
                <a href="#" className="text-primary text-sm hover:text-sucess">
                  Enviar mensagem ao vendedor
                </a>
              </div>

              <div className="flex flex-col gap-2 min-w-[140px] w-full sm:w-auto">
                <button className="bg-primary hover:bg-sucess text-white font-bold py-1.5 px-3 rounded-lg w-full">
                  Ver compra
                </button>
                <button className="bg-green-100 hover:bg-green-200 text-primary-dark font-bold py-1.5 px-3 rounded-lg w-full">
                  Comprar novamente
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
