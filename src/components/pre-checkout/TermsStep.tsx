"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, EyeOff } from "lucide-react";
import { PreCheckoutFormType } from "./PreCheckoutForm";

export default function TermsStep() {
    const { control } = useFormContext<PreCheckoutFormType>();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Termo de venda</h2>
            </div>

            <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Cabeçalho do PDF */}
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600" />
                                <span className="font-medium">Termo de venda - Venda+ Agromarket</span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2"
                            >
                                {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {isExpanded ? "Ocultar" : "Visualizar"}
                            </Button>
                        </div>

                        {/* Conteúdo expandível */}
                        {isExpanded && (
                            <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                                <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                                    <p className="text-sm leading-relaxed">
                                        <strong>LGPD (Lei Geral de Proteção de Dados)</strong><br />
                                        A Lei Geral de Proteção de Dados (LGPD - Lei 13.709/18) é a legislação brasileira que regula as atividades de tratamento de dados pessoais e que também altera os artigos 7º e 16 do Marco Civil da Internet. A principal intenção da lei é proteger os direitos fundamentais de liberdade e de privacidade e a livre formação da personalidade de cada indivíduo. A LGPD se aplica a qualquer operação de tratamento realizada por pessoa física ou por pessoa jurídica de direito público ou privado, independentemente do meio, do país de sua sede ou do país onde estejam localizados os dados.
                                    </p>

                                    <p className="text-sm leading-relaxed">
                                        Para compreender a aplicação da LGPD é preciso conhecer alguns conceitos importantes. Em primeiro lugar, o que são dados pessoais? A LGPD considera dados pessoais toda informação relacionada a pessoa natural identificada ou identificável. Além dos dados pessoais, existe uma outra categoria que demanda ainda maior proteção: os dados pessoais sensíveis.
                                    </p>

                                    <p className="text-sm leading-relaxed">
                                        <strong>Dados pessoais sensíveis:</strong> são informações sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.
                                    </p>

                                    <p className="text-sm leading-relaxed">
                                        <strong>Dados pessoais:</strong> são todas informações relacionadas a uma pessoa natural que possa identificá-la. Ainda, os dados pessoais podem ser dados pessoais sensíveis, esses são todas informações sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.
                                    </p>

                                    <p className="text-sm leading-relaxed font-semibold">
                                        É importante pontuar que:
                                    </p>

                                    <ul className="text-sm space-y-2 ml-4">
                                        <li>• <strong>Política de Privacidade</strong> se refere a informações específicas de coleta, armazenamento e proteção de dados pessoas de usuários de um site ou aplicativo.</li>
                                        <li>• <strong>Termos e Condições Gerais de Uso</strong> servem para indicar as regras que devem ser respeitadas ao utilizar a plataforma. Ou seja, informam as obrigações e direitos dos usuários como também da plataforma, visto que o mesmo serve como uma espécie de contrato de adesão.</li>
                                    </ul>

                                    <p className="text-sm leading-relaxed">
                                        Assim, compreendendo essa diferença, caso o contrato que se encaixe em sua situação seja o Termos e Condições Gerais de Uso, indicamos que você consulte nosso modelo: <span className="text-blue-600 underline cursor-pointer">Termos e Condições de Uso</span>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Link para PDF completo */}
                        <div className="pt-4">
                            <a
                                href="/termo-de-venda.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 underline text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Abrir documento completo (PDF)
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Checkbox de aceite */}
            <FormField
                control={control}
                name="terms.accepted"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 p-4 bg-green-50 rounded-lg border">
                        <FormControl>
                            <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <label className="text-sm font-medium leading-relaxed">
                                Li e estou de acordo com o <span className="text-green-600 underline cursor-pointer">Termo de Venda</span>.
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}