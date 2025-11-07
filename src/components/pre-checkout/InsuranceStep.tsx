"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { insuranceOptions } from "@/utils/data";
import { ControllerRenderProps } from "react-hook-form";
import { PreCheckoutFormType } from "./PreCheckoutForm";

export default function InsuranceStep({
  ...field
}: ControllerRenderProps<PreCheckoutFormType>) {
  return (
    <FormItem className="space-y-6">
      <FormLabel className="text-lg font-semibold">Seguro</FormLabel>
      <FormControl>
        <RadioGroup
          value={field.value?.toString()}
          onValueChange={field.onChange}
          className="space-y-3"
        >
          {insuranceOptions.map((o) => (
            <div
              key={o.id}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50"
            >
              <FormControl>
                <RadioGroupItem value={o.id.toString()} />
              </FormControl>
              <div>
                <Label htmlFor={o.id.toString()} className="font-medium">
                  {o.title}
                </Label>
                <p className="text-sm text-gray-600">{o.description}</p>
                {o.recommended && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    RECOMENDADO
                  </span>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
      <p className="text-sm text-gray-600">
        Ao escolher um seguro, você aceita as{" "}
        <span className="text-green-600 underline cursor-pointer">
          Condições gerais
        </span>{" "}
        e os{" "}
        <span className="text-green-600 underline cursor-pointer">
          Termos de cobrança do Prêmio do seguro
        </span>
        .
      </p>
    </FormItem>
  );
}
