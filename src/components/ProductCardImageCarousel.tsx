import { ImageOff } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from './ui/carousel';
import Image from 'next/image';

interface ProductCardCarouselProps {
	images: string[];
}

export default function ProductCardCarousel({
	images,
}: ProductCardCarouselProps) {
	const hasImages = !!images.length;

	if (hasImages)
		return (
			<Carousel
				opts={{
					watchDrag: false,
				}}
				className="w-full"
			>
				<CarouselContent>
					{images.map((img, ind) => {
						return (
							<CarouselItem key={ind} className="h-40 relative">
								<Image
									src={img}
									fill
									alt={`Imagem ${ind + 1}`}
									className="object-cover"
								/>
							</CarouselItem>
						);
					})}
				</CarouselContent>

				{images.length > 1 && (
					<>
						<CarouselPrevious className="ml-12 size-8 sm:size-8 sm:ml-12" />
						<CarouselNext className="mr-12 size-8 sm:size-8 sm:mr-12" />
					</>
				)}
			</Carousel>
		);

	return (
		<div className="flex items-center justify-center h-40 text-neutral-300 bg-neutral-100">
			<ImageOff size={60} />
		</div>
	);
}
