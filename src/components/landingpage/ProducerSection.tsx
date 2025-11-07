// components/ProducerSection.tsx
'use client'
import { ChartNoAxesCombined, CreditCard, HandCoins, Lock, Megaphone, Monitor, ShoppingCart, Truck } from 'lucide-react'
import React, { useState } from 'react'

export default function ProducerSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sell'>('overview')

  return (
    <section id="produtor" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 overflow-hidden">
          {/** Header + Tabs **/}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Sou Produtor</h2>
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
                  Como Vender
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
                  Na <strong className="font-semibold">Venda+ Agromarket</strong>, o produtor é o protagonista. Valorizamos a produção agrícola regional e, por isso, nossa missão é ampliar o alcance dos pequenos e médios produtores, eliminando as barreiras de comunicação e acesso ao mercado que ainda existem. Nosso compromisso é combater a desigualdade presente no meio comercial, oferecendo aos produtores a oportunidade de negociar de forma justa e direta.
                </p>
                <p>
                  Através da nossa plataforma, o produtor tem total autonomia para divulgar e vender seus produtos de maneira simples, rápida e segura.
                </p>
              </div>
              {/* Benefícios Visão Geral */}
              <div className="lg:w-1/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
                  <Lock size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                    Ambiente Seguro e Confiável
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
                  <HandCoins size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                    Melhor Rentabilidade
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
				  <ChartNoAxesCombined size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                    Gestão Simplificada
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-r-2xl space-y-2">
				  <Megaphone size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm text-center">
                    Maior Divulgação dos Seus Produtos
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Texto Como Vender */}
              <p className="text-white leading-relaxed">
                O processo é simples: após realizar o cadastro na plataforma como Cliente e Produtor, basta enviar a solicitação de adesão para análise. Nossa equipe fará a verificação das informações e, após a validação, o produtor estará apto a divulgar seus produtos, definir preços, controlar seu estoque e iniciar as vendas diretamente para atacadistas, varejistas e consumidores de todo o Brasil.
              </p>
              {/* Passos Como Vender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
				  <Monitor size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm">Criar anúncio</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
				  <ShoppingCart size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm">Cliente compra</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
				  <CreditCard size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm">Pagamento</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-r-2xl">
				  <Truck size={32} className='text-green-700'/>
                  <span className="text-gray-800 font-medium text-sm">Envio do produto</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
