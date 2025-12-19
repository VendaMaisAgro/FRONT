import {
	AlertDialogHeader,
	AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Camera, CirclePlus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ImageRenderer from './ImageRenderer';
import { FormImage } from '@/types/types';

type ValidationErrors = {
	state: boolean;
	message?: string;
};

interface FormImagesPreviewerProps {
	images: FormImage[];
	validationErrors: ValidationErrors;
	removeImageFromForm: (index: number) => void;
	addImagesToForm: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormImagesCarousel({
	images,
	validationErrors,
	removeImageFromForm,
	addImagesToForm,
}: FormImagesPreviewerProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [isMobile, setIsMobile] = useState(false);

	const inputFileGallery = useRef<HTMLInputElement>(null);
	const inputFileCamera = useRef<HTMLInputElement>(null);

	function handleResize() {
		setWindowWidth(window.innerWidth);
		setIsMobile(window.innerWidth < 768);
	}

	function handleRemoveImage(index: number) {
		removeImageFromForm(index);

		if (index === images.length - 1) {
			setSelectedImageIndex(0);
		} else {
			setSelectedImageIndex(index);
		}
	}

	useEffect(() => {
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className="flex gap-2 flex-col-reverse min-[520px]:flex-row min-[520px]:justify-center w-full">
			<Carousel
				opts={{
					align: 'start',
				}}
				orientation={windowWidth > 520 ? 'vertical' : 'horizontal'}
				className="min-[520px]:h-52 min-[520px]:w-14"
			>
				{images.length ? (
					<>
						<CarouselContent className="my-2 min-[520px]:h-52 min-[520px]:-mt-4">
							{images.map((img, ind) => (
								<CarouselItem
									key={ind}
									className="basis-1/5 min-[520px]:basis-1/4 min-[520px]:pt-5"
								>
									<li
										className={`relative size-12 mx-auto list-none ${selectedImageIndex === ind &&
											'ring-2 rounded-md ring-primary transition-all duration-300'
											}`}
									>
										<button
											onClick={() => setSelectedImageIndex(ind)}
											className="cursor-pointer"
											type="button"
										>
											<ImageRenderer image={img} position={ind} />
										</button>
									</li>
								</CarouselItem>
							))}
						</CarouselContent>

						<CarouselPrevious
							className="-left-5 min-[520px]:left-5 sm:left-7 sm:size-7 min-[520px]:-top-5"
							type="button"
						/>

						<CarouselNext
							className="-right-5 sm:size-7 sm:right-0 min-[520px]:-bottom-1"
							type="button"
						/>
					</>
				) : (
					<></>
				)}
			</Carousel>

			<div className="relative">
				<div className="relative w-full h-82 min-[520px]:size-96">
					{images.length ? (
						<ImageRenderer
							image={images[selectedImageIndex]}
							position={selectedImageIndex}
						/>
					) : (
						<div
							className={`flex flex-col items-center justify-center w-full h-full rounded-md ${validationErrors.state
									? 'bg-red-200 border border-red-400'
									: 'bg-zinc-200'
								}`}
						>
							<Camera
								size={96}
								className={`${validationErrors.state ? 'text-red-400' : 'text-zinc-400'
									}`}
							/>

							{validationErrors.state ? (
								<p className="text-red-500 text-sm">
									{validationErrors.message}
								</p>
							) : (
								<></>
							)}
						</div>
					)}
				</div>

				{images.length ? (
					<Button
						variant="destructive"
						className="absolute top-2 right-2"
						onClick={() => handleRemoveImage(selectedImageIndex)}
						type="button"
					>
						<Trash2 />
						Remover
					</Button>
				) : (
					<></>
				)}

				<input
					type="file"
					ref={inputFileGallery}
					className="hidden"
					accept="image/png, image/jpeg, image/webp"
					multiple
					onChange={addImagesToForm}
				/>

				<input
					type="file"
					ref={inputFileCamera}
					className="hidden"
					accept="image/png, image/jpeg, image/webp"
					capture="environment"
					onChange={addImagesToForm}
				/>

				{/* Botão com AlertDialog */}
				{isMobile ? (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" className="w-full mt-4">
								<CirclePlus />
								Adicionar fotos
							</Button>
						</AlertDialogTrigger>

						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Adicionar fotos</AlertDialogTitle>

								<AlertDialogDescription>
									Escolha de onde quer enviar suas fotos.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter className="flex flex-col items-center w-full gap-2">
								<button
									type="button"
									className="w-full px-4 py-2 rounded-md bg-sucess text-white font-semibold"
									onClick={() => inputFileGallery.current?.click()}
								>
									Galeria
								</button>

								<button
									type="button"
									className="w-full px-4 py-2 rounded-md bg-sucess text-white font-semibold"
									onClick={() => inputFileCamera.current?.click()}
								>
									Câmera
								</button>

								<AlertDialogCancel className="w-full">
									Cancelar
								</AlertDialogCancel>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				) : (
					<Button
						type="button"
						className="w-full mt-4"
						onClick={() => inputFileGallery.current?.click()}
					>
						<CirclePlus />
						Adicionar fotos
					</Button>
				)}
			</div>
		</div>
	);
}
