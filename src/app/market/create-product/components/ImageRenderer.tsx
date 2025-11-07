// ImagePreview.tsx
import { FormImage } from '@/types/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageRendererProps {
	image: FormImage;
	position: number;
}

export default function ImageRenderer({ image, position }: ImageRendererProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		if (image instanceof File) {
			const objectUrl = URL.createObjectURL(image);
			setPreviewUrl(objectUrl);

			return () => {
				URL.revokeObjectURL(objectUrl);
				setPreviewUrl(null);
			};
		} else if (typeof image === 'string' && image) {
			setPreviewUrl(image);
		} else {
			setPreviewUrl(null);
		}
	}, [image]);

	return (
		<>
			{previewUrl && (
				<>
					<Image
						src={previewUrl}
						alt={`Imagem ${position + 1}`}
						fill
						className="object-cover rounded-md"
					/>
				</>
			)}
		</>
	);
}
