// components/ProducerSection.tsx
'use client'
import React, { useState } from 'react'
import { Apple, Box, CreditCard, Handshake, Search, ShoppingBag, ShoppingCart } from 'lucide-react'

export default function ProducerSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sell'>('overview')

  return (
    <section id="cliente" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#804B24] rounded-2xl p-8 overflow-hidden">
          {/** Header + Tabs **/}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Sou Cliente</h2>
            <nav>
              <ul className="flex space-x-6">
                <li
                  className={
                    `cursor-pointer pb-2 ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-white text-white font-medium'
                        : 'text-white/75 hover:text-white'
                    }`
                  }
                  onClick={() => setActiveTab('overview')}
                >
                  Visão Geral
                </li>
                <li
                  className={
                    `cursor-pointer pb-2 ${
                      activeTab === 'sell'
                        ? 'border-b-2 border-white text-white font-medium'
                        : 'text-white/75 hover:text-white'
                    }`
                  }
                  onClick={() => setActiveTab('sell')}
                >
                  Como Comprar
                </li>
              </ul>
            </nav>
          </div>

          {/** Tab Content **/}
          {activeTab === 'overview' ? (
            <div className="mt-6 flex flex-col lg:flex-row gap-8">
              {/* Texto Visão Geral */}
              <div className="lg:w-2/3 space-y-4 text-white leading-relaxed">
                <p>
                  Na <strong className="font-semibold">Venda+ Agromarket</strong>,  oferecemos aos nossos clientes acesso a uma ampla variedade de produtos agrícolas frescos e de qualidade, reunidos em um só lugar. A plataforma foi pensada para facilitar sua busca, permitindo que você encontre exatamente o que procura entre as ofertas de diversos produtores locais e regionais.
                </p>
                <p>
                  Aqui, você tem a oportunidade de se conectar diretamente com quem produz. Caso surjam dúvidas sobre os produtos, condições, procedência ou formas de cultivo, é possível falar diretamente com o produtor, recebendo informações claras, transparentes e em primeira mão.
                </p>
              </div>
              {/* Benefícios Visão Geral */}
              <div className="lg:w-1/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
                  <ShoppingCart size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                  Facilidade na Compra
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
                  <Search size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                  Variedade e Busca Inteligente
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
                  <Handshake size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                  Contato Direto com o Produtor
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
                  <Apple size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                    Produto Fresco, Saudável e Local
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Texto Como Vender */}
              <p className="text-white leading-relaxed">
              Ao realizar seu cadastro como Cliente, você já estará automaticamente habilitado para navegar pela plataforma, montar seu carrinho com uma ampla variedade de produtos e finalizar suas compras com poucos cliques. A entrega será feita pelo próprio produtor, conforme a disponibilidade de envio para a sua região. Em alguns casos, também é possível optar pela retirada presencial, caso o produtor ofereça essa modalidade.
              </p>
              {/* Passos Como Vender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
                  <Search size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm">Procurar anúncio</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
                  <ShoppingBag size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm">Comprar produto</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
                  <CreditCard size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm">Pagamento</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
                  <Box size={32} className="text-yellow-700"/>
                  <span className="text-gray-800 font-medium text-sm">Recebe o produto</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
