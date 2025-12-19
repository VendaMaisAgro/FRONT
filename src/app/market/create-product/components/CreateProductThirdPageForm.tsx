import { CreateProductSchemaType } from '@/lib/schemas';
import { compressImage } from '@/utils/compressImage';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormImagesCarousel from './FormImagesCarousel';

export default function CreateProductThirdPageForm({
  form,
}: {
  form: UseFormReturn<CreateProductSchemaType>;
}) {
  const images = form.watch('images');
  const sellingUnits = form.getValues('sellingUnits') || [];
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);

  async function handleAddNewImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Compress all images
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file, 1920, 1920, 0.8))
      );

      form.setValue('images', [...images, ...compressedFiles], {
        shouldValidate: true,
      });

      e.target.value = '';
    }
  }

  function handleRemoveImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);

    form.setValue('images', [...newImages], {
      shouldValidate: true,
    });
  }

  return (
    <>
      <div className="flex flex-col justify-center space-x-8 space-y-4 md:flex-row w-full">
        <FormImagesCarousel
          images={form.watch('images')}
          validationErrors={{
            state: form.formState.errors.images ? true : false,
            message: form.formState.errors.images?.message,
          }}
          addImagesToForm={handleAddNewImages}
          removeImageFromForm={handleRemoveImage}
        />

        <div className="w-1/2 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">
            {form.getValues('name')}
          </h1>

          <div className="flex items-center mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => {
                return (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-yellow-400"
                    size={16}
                  />
                );
              })}
            </div>
            <span className="ml-2 text-sm text-gray-600">100 avaliações</span>
          </div>

          {/* Unidades de venda */}
          {sellingUnits.length > 0 && (
            <div className="mt-6">
              <h4 className="text-gray-700 mb-2">Preço mínimo</h4>
              <div className="text-3xl font-bold text-gray-900">
                {sellingUnits[selectedUnitIndex]?.minPrice}
                <span className="text-sm text-primary">
                  /{sellingUnits[selectedUnitIndex]?.acronym}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-gray-700">Und.</span>
                <Select
                  value={String(selectedUnitIndex)}
                  onValueChange={(value) => setSelectedUnitIndex(Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellingUnits.map((unit, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {unit.acronym}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Descrição do produto */}
          {form.getValues('description') && (
            <div className="mt-6 max-w-2xl">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Descrição</h4>
              <p className="text-sm leading-relaxed">
                {form.getValues('description')}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}