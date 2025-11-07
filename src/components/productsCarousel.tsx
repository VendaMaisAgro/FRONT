"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { MarketProductCardType } from "@/types/types";
import MarketProductCard from "./market-product-card";

export default function ProductsCarousel({
	products,
}: {
	products: MarketProductCardType[];
}) {
	if (products.length === 0) {
		return (
			<div className="w-full py-16 text-center flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
				<p className="text-lg text-muted-foreground mb-4">
					Nenhum produto disponível no momento.
				</p>
			</div>
		);
	}

	return (
		<Carousel
			className="flex justify-center"
			opts={{
				watchDrag: false,
			}}
		>
			<CarouselContent
				className="-ml-4 min-[500px]:-ml-12"
				contentContainerClassname="w-full"
			>
				{products.map((p, idx) => (
					<CarouselItem
						key={idx}
						className="basis-[92%] pl-4 min-[500px]:basis-[60%] min-[500px]:pl-12 min-[670px]:basis-[45%] 2xl:basis-[30%]"
					>
						<MarketProductCard product={p} />
					</CarouselItem>
				))}
			</CarouselContent>

			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
