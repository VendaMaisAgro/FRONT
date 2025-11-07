// components/AboutSection.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'


const AboutSection = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const section = document.getElementById('sobre')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="sobre" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Texto */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-foreground mb-6">Sobre nós</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Na <strong className="text-primary">Venda+ Agromarket</strong>, valorizamos a produção agrícola regional e acreditamos no potencial dos pequenos e médios produtores. Nossa missão é ampliar o alcance da produção, eliminando as barreiras de comercialização e possibilitando o acesso ao mercado e combatendo as desigualdades que muitas vezes afetam quem vive do campo.
                </p>
                <p>
                  Por meio da nossa plataforma, oferecemos ferramentas que permitem ao produtor divulgar seus produtos e vendê-los de forma simples, rápida e eficiente. Aqui, o produtor tem controle total sobre o processo de venda, sem depender de intermediários, garantindo mais autonomia, melhores negociações e uma conexão direta com seus clientes.
                </p>
              </div>
            </div>
            {/* Ilustração */}
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/sobre.png"
                alt="Ilustração sobre nós"
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection