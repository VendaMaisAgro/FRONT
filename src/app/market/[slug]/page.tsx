import MarketProductCard from "@/components/market-product-card";
import Navbar from "@/components/navbar";
import { MarketProductCardType } from "@/types/types";
import { Search } from "lucide-react";
import { cookies } from "next/headers";
import SideFilterMenu from "./components/sideFilterMenu";

export default async function ProductSearchPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_URL}/api/sellerProducts?name=${slug}`,
		{
			method: "GET",
			headers: {
				Cookie: `session=${token}`,
			},
		}
	);
	const products: MarketProductCardType[] = await res.json();
	const decodedSearchedWord = decodeURIComponent(slug.replaceAll("-", " "));

	if (!products.length) {
		return (
			<>
				<Navbar searchedItem={decodedSearchedWord} />
				<div className="flex flex-col items-center gap-8 bg-white p-8 m-auto max-w-[700px] w-4/5 mt-14 rounded-xl md:gap-14 md:flex-row">
					<Search className="text-primary size-24" />
					<div className="space-y-2">
						<h4 className="font-semibold text-xl">
							Ops, não encontramos nenhum anúncio que corresponde à sua busca.
						</h4>
						<ul className="list-disc ml-5 text-sm">
							<li>Revise a escrita da palavra.</li>
							<li>Utilize palavras mais comuns ou menos palavras.</li>
							<li>
								Navegue pelas categorias para encontrar produtos semelhantes.
							</li>
						</ul>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<Navbar searchedItem={decodedSearchedWord} />
			<section className="flex flex-col mt-0 max-w-7xl m-auto mb-14 w-10/12 lg:flex-row lg:mt-8">
				{/* <TanstackProvider> */}
				{/* <FilterDrawer /> */}
				<SideFilterMenu
					searchedProduct={decodedSearchedWord.toUpperCase()}
					amountFound={products.length}
				/>
				{/* </TanstackProvider> */}
				<div className="flex flex-col items-center flex-1 mt-10 md:mt-0">
					<ul className="grid grid-cols-2 2xl:grid-cols-3 gap-12 md:gap-20">
						{products.map((p) => {
							return (
								<li key={p.id}>
									<MarketProductCard product={p} />
								</li>
							);
						})}
					</ul>
					{/* <footer className="mt-10">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious href="#" />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#" isActive>
										1
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#">2</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationNext href="#" />
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</footer> */}
				</div>
			</section>
		</>
	);
}
