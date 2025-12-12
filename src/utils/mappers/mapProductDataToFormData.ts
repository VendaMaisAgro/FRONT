import { CreateProductSchemaType } from '@/lib/schemas';
import { removeMoneyMask } from '@/utils/functions';

export function mapProductDataToFormData(
	values: CreateProductSchemaType
): FormData {
	const formData = new FormData();

	formData.append('name', values.name);
	formData.append('variety', values.variety);
	formData.append('category', values.category);
	formData.append('harvestAt', values.harvestAt.toISOString());
	formData.append('isNegotiable', values.isNegotiable.toString());
	formData.append('stock', values.amount);
	formData.append('description', values.description);

	const sellingUnitsJson = JSON.stringify(
		values.sellingUnits.map((s) => ({
			minPrice: removeMoneyMask(s.minPrice),
			unitId: s.unitId,
		}))
	);
	formData.append('sellingUnitProduct', sellingUnitsJson);

	values.images.forEach((file) => {
		formData.append('images', file);
	});

	return formData;
}

/**
 * Converte dados da EDIÇÃO de produto para FormData
 * Separa URLs existentes (strings) de novos arquivos (Files)
 */
export function mapEditProductDataToFormData(
	values: CreateProductSchemaType
): FormData {
	const formData = new FormData();

	formData.append('name', values.name);
	formData.append('variety', values.variety);
	formData.append('category', values.category);
	formData.append('harvestAt', values.harvestAt.toISOString());
	formData.append('isNegotiable', values.isNegotiable.toString());
	formData.append('stock', values.amount);
	formData.append('description', values.description);

	const sellingUnitsJson = JSON.stringify(
		values.sellingUnits.map((s) => ({
			minPrice: removeMoneyMask(s.minPrice),
			unitId: s.unitId,
		}))
	);
	formData.append('sellingUnitProduct', sellingUnitsJson);

	// Separar imagens existentes (URLs do S3) de novas imagens (Files)
	const existingImages: string[] = [];
	const newImages: File[] = [];

	values.images.forEach((image) => {
		if (typeof image === 'string') {
			// É uma URL do S3 - deve ser mantida
			existingImages.push(image);
		} else if (image instanceof File) {
			// É um arquivo novo - deve ser enviado para upload
			newImages.push(image);
		}
	});

	// Enviar URLs das imagens existentes como JSON
	if (existingImages.length > 0) {
		formData.append('existingImages', JSON.stringify(existingImages));
	}

	// Enviar novos arquivos de imagem para upload
	newImages.forEach((file) => {
		formData.append('images', file);
	});

	return formData;
}