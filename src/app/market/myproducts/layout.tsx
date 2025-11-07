import Navbar from "@/components/navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Meus produtos | Venda+",
	description: "Marketplace",
};

export default function MyProductsLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
