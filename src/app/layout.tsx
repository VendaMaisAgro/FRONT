// app/landingpage/layout.tsx
import "@/app/globals.css";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Venda+ Agromarket - Conectando Produtores e Clientes",
	description:
		"Plataforma que conecta produtores agrícolas regionais diretamente com seus clientes, eliminando intermediários.",
	keywords:
		"agricultura, agromarket, produtores, clientes, venda direta, produtos regionais",
};

export default function LandingPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`bg-zinc-100 ${inter.className}`}>
				<NextTopLoader
					color="#3b9535"
					showSpinner={false}
					shadow={false}
					height={3}
				/>
				<>{children}</>
				<Toaster />
			</body>
		</html>
	);
}
