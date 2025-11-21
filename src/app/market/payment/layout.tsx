import Navbar from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pagamento | Venda+",
	description: "Finalize o pagamento do seu pedido",
};

export default function PaymentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navbar />
			<main className="flex-1">{children}</main>
		</div>
	);
}
