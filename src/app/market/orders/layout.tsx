import Navbar from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Pedidos | Venda+",
	description: "Marketplace",
};

export default function OrdersLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
