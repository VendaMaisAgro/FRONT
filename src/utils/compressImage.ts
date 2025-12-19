/**
 * Compress an image file using the browser's Canvas API.
 * 
 * @param file - The image file to compress
 * @param maxWidth - The maximum width of the output image (default: 1920)
 * @param maxHeight - The maximum height of the output image (default: 1920)
 * @param quality - The image quality from 0 to 1 (default: 0.8)
 * @returns A promise that resolves to the compressed File object
 */
export async function compressImage(
    file: File,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8
): Promise<File> {
    // If not an image, return original
    if (!file.type.startsWith('image/')) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file); // Fallback to original if context fails
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file); // Fallback
                            return;
                        }

                        // If compressed file is larger than original, return original
                        if (blob.size >= file.size) {
                            resolve(file);
                            return;
                        }

                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    file.type,
                    quality
                );
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}
