import Navbar from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout | Venda+",
    description: "Confirme as informações do seu pedido antes de finalizar a compra",
};

export default function OrderHistoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {children}
        </div>
    );
}
