'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ProductDetailImagesViewerProps {
	images: string[];
	productName: string;
}

export default function ProductDetailImagesViewer({
	images,
	productName,
}: ProductDetailImagesViewerProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [windowWidth, setWindowWidth] = useState(0);

	function handleResize() {
		setWindowWidth(window.innerWidth);
	}

	useEffect(() => {
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className="flex gap-2 flex-col-reverse lg:flex-row lg:justify-center">
			<Carousel
				opts={{
					align: 'start',
				}}
				orientation={windowWidth > 1024 ? 'vertical' : 'horizontal'}
				className="lg:h-72 lg:w-16"
			>
				{images.length ? (
					<>
						<CarouselContent className="my-2 lg:h-72 lg:-mt-4">
							{images.map((img, ind) => (
								<CarouselItem
									key={ind}
									className="basis-1/5 pl-8 sm:pl-0 lg:basis-1/4 lg:pt-5"
								>
									<li
										className={`relative size-14 mx-auto list-none ${
											selectedImageIndex === ind &&
											'ring-2 rounded-md ring-primary transition-all duration-300'
										}`}
									>
										<button
											onClick={() => setSelectedImageIndex(ind)}
											className="cursor-pointer"
											type="button"
										>
											<Image
												src={img}
												fill
												alt={`Imagem ${ind + 1}`}
												className="object-cover"
											/>
										</button>
									</li>
								</CarouselItem>
							))}
						</CarouselContent>

						{images.length > 4 && (
							<>
								<CarouselPrevious
									className="-left-5 lg:left-5 sm:left-7 sm:size-7 lg:-top-5"
									type="button"
								/>
								<CarouselNext
									className="-right-5 sm:size-7 sm:right-0 lg:-bottom-1"
									type="button"
								/>
							</>
						)}
					</>
				) : (
					<></>
				)}
			</Carousel>

			<div className="w-full">
				<div className="relative w-full h-82 lg:size-[580px]">
					{images.length ? (
						<Image
							src={images[selectedImageIndex]}
							fill
							alt={`Imagem ${selectedImageIndex + 1} do produto ${productName}`}
							className="rounded-2xl object-cover"
						/>
					) : (
						<div className="flex justify-center items-center h-full rounded-2xl text-neutral-300 bg-neutral-200">
							<ImageOff size={70} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
