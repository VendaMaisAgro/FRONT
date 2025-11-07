import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Endereços | Venda+",
	description: "Marketplace",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
