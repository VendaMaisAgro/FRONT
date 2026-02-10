"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-primary-dark">Fale Conosco</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                    Estamos aqui para ajudar! Entre em contato conosco para tirar dúvidas,
                    enviar sugestões ou relatar problemas.
                </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-sm w-full space-y-6">
                <div className="flex justify-center">
                    <div className="bg-green-50 p-4 rounded-full">
                        <Mail size={48} className="text-primary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800">Email</h2>
                    <p className="text-gray-500">vendamaisagro@gmail.com</p>
                    <p className="text-sm text-green-600 font-medium">
                        Resposta em até 48h
                    </p>
                </div>

                <a
                    href="mailto:vendamaisagro@gmail.com"
                    className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    Enviar Mensagem
                </a>
            </div>

            <Link
                href="/market"
                className="text-primary hover:underline text-sm font-medium"
            >
                Voltar para o início
            </Link>
        </div>
    );
}
