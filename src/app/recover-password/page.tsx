"use client"

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  const [metodo, setMetodo] = useState<'email' | 'telefone'>('email');

  return (
    <div className="bg-background min-h-screen flex flex-col md:flex-row relative">
      {/* Botão voltar */}
      <Link
        href="/login"
        aria-label="Voltar para o login"
        className="absolute top-6 left-6 text-gray-600 hover:text-black z-50"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Formulário */}
      <div className="w-full md:w-[40%] bg-white px-6 py-12 md:px-20 md:py-16 flex items-center">
        <div className="w-full text-black">
          <h2 className="text-2xl font-bold text-center mb-2">Recuperação de senha</h2>
          <p className="text-sm text-center text-gray-600 mb-10">
            Selecione por onde deseja receber a solicitação de recuperação.
          </p>

          <form action="/identity-verification" method="GET" className="w-full">
            <div className="flex gap-8 justify-center mb-10">
              <label className="flex items-center gap-2 font-medium text-sm">
                <input
                  type="radio"
                  name="metodo"
                  value="email"
                  checked={metodo === 'email'}
                  onChange={() => setMetodo('email')}
                />
                Email
              </label>
              <label className="flex items-center gap-2 font-medium text-sm">
                <input
                  type="radio"
                  name="metodo"
                  value="telefone"
                  checked={metodo === 'telefone'}
                  onChange={() => setMetodo('telefone')}
                />
                Telefone
              </label>
            </div>

            {metodo === 'email' ? (
              <div className="mb-5">
                <label className="block mb-1 font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu email"
                  required
                  className="w-full border border-border rounded px-4 py-3 outline-none outline-ring/50 focus:ring-2 focus:ring-green-600"
                />
              </div>
            ) : (
              <div className="mb-5">
                <label className="block mb-1 font-medium">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Digite seu telefone"
                  required
                  className="w-full border border-border rounded px-4 py-3 outline-none outline-ring/50 focus:ring-2 focus:ring-green-600"
                />
              </div>
            )}

            <Link href="/identity-verification">
            <button
              type="button"
              className="w-full p-3 text-white rounded font-medium bg-primary hover:bg-sucess transition mt-5"
            >
              Próximo
            </button>
          </Link>
          </form>
        </div>
      </div>

      {/* Imagem com logo */}
      <div className="hidden md:block w-full md:w-[60%] relative">
        <div className="absolute top-6 left-6 z-10">
          <Image
            src="/logoVenda+Agromarket.svg"
            alt="Venda+ Agromarket"
            width={150}
            height={50}
            priority
          />
        </div>
        <Image
          src="/imagemAgricultor1.png"
          alt="Imagem agrícola"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
