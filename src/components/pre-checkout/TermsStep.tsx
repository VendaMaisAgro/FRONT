"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, EyeOff } from "lucide-react";
import type { PreCheckoutFormType } from "./PreCheckoutForm";
import { getUserData, getProducerById, type FullUserData } from "@/actions/user";
import { getProductDetails } from "@/actions/product";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import ContractTemplate from "@/components/sale/ContractTemplate";

interface SellerDetail {
    name?: string;
    cnpj?: string;
    cpf?: string;
    address?: string;
    role?: string;
}

interface ProductDetail {
    productId: string;
    name: string;
    variety?: string;
    harvestAt?: string;
    amount: number;
    unitPrice: number;
    unit: string;
}

function addDays(iso: string, days: number): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}

export default function TermsStep() {
    const { control, watch } = useFormContext<PreCheckoutFormType>();
    const [isExpanded, setIsExpanded] = useState(false);
    const [buyer, setBuyer] = useState<FullUserData | null>(null);
    const [sellerDetail, setSellerDetail] = useState<SellerDetail | null>(null);
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

    const [packagingType, setPackagingType] = useState("");
    const [plannedPickupDate, setPlannedPickupDate] = useState("");
    const [plannedDeliveryDate, setPlannedDeliveryDate] = useState("");

    const {
        getSellers,
        orderValue,
        getProducts,
        setPackagingType: storeSetPackagingType,
        setContractSnapshot,
    } = useCheckoutStore();
    const sellers = getSellers();
    const seller = sellers[0];
    const storeProducts = getProducts();
    const payment = watch("payment");
    const total = orderValue();

    // Fetch buyer data
    useEffect(() => {
        getUserData().then(setBuyer).catch(console.error);
    }, []);

    // Fetch seller data
    useEffect(() => {
        if (!seller?.id) return;
        getProducerById(seller.id)
            .then((data) => {
                if (!data) return;
                const rawAddress = data.address ?? data.user?.address;
                const address =
                    typeof rawAddress === "string"
                        ? rawAddress
                        : rawAddress
                        ? `${rawAddress.street ?? ""}, ${rawAddress.number ?? ""} - ${rawAddress.city ?? ""} - ${rawAddress.uf ?? rawAddress.state ?? ""}`.replace(/^[,\s-]+|[,\s-]+$/g, "")
                        : undefined;
                setSellerDetail({
                    name: data.name ?? data.user?.name ?? seller.name,
                    cnpj: data.cnpj ?? data.user?.cnpj,
                    cpf: data.cpf ?? data.user?.cpf,
                    address,
                    role: data.role ?? data.user?.role,
                });
            })
            .catch(() => setSellerDetail({ name: seller.name }));
    }, [seller?.id]);

    // Fetch product details
    useEffect(() => {
        if (!storeProducts.length) return;
        Promise.all(
            storeProducts.map(async (p) => {
                const detail = await getProductDetails(p.productId);
                const matchingUnit = detail?.sellingUnitProduct?.find(
                    (sup: { id: string }) => sup.id === p.sellingUnitProductId
                );
                return {
                    productId: p.productId,
                    name: detail?.name ?? "",
                    variety: detail?.variety,
                    harvestAt: detail?.harvestAt,
                    amount: p.amount,
                    unitPrice: p.amount > 0 ? p.value / p.amount : p.value,
                    unit: matchingUnit?.unit?.unit ?? matchingUnit?.unit?.title ?? "",
                } as ProductDetail;
            })
        )
            .then(setProductDetails)
            .catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeProducts.length]);

    // Auto-fill dates from harvestAt + 15 days
    useEffect(() => {
        const harvestIso = productDetails[0]?.harvestAt;
        if (harvestIso) {
            const plus15 = addDays(harvestIso, 15);
            if (!plannedPickupDate)   setPlannedPickupDate(plus15);
            if (!plannedDeliveryDate) setPlannedDeliveryDate(plus15);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productDetails]);

    // Sync contract snapshot to checkout store whenever resolved data changes
    useEffect(() => {
        if (!buyer && !sellerDetail && !productDetails.length) return;
        setContractSnapshot({
            buyer: {
                name:    buyer?.name ?? undefined,
                cpf:     buyer?.cpf  ?? undefined,
                cnpj:    buyer?.cnpj ?? undefined,
                address: buyer?.address ?? undefined,
                role:    buyer?.role ?? undefined,
            },
            seller: {
                name:    sellerDetail?.name ?? seller?.name,
                cpf:     sellerDetail?.cpf,
                cnpj:    sellerDetail?.cnpj,
                address: sellerDetail?.address,
                role:    sellerDetail?.role,
            },
            items: productDetails.map((p) => ({
                productId: p.productId,
                name:      p.name,
                variety:   p.variety,
                harvestAt: p.harvestAt,
                amount:    p.amount,
                unit:      p.unit,
                unitPrice: p.unitPrice,
                packagingType: packagingType || undefined,
            })),
            conditions: {
                paymentMethod:       payment?.method,
                total,
                plannedHarvestDate:  productDetails[0]?.harvestAt,
                plannedPickupDate:   plannedPickupDate || undefined,
                plannedDeliveryDate: plannedDeliveryDate || undefined,
            },
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buyer, sellerDetail, productDetails, packagingType, plannedPickupDate, plannedDeliveryDate, payment?.method, total]);

    const preCheckoutData = {
        buyer: {
            name: buyer?.name ?? undefined,
            cpf:  buyer?.cpf  ?? undefined,
            cnpj: buyer?.cnpj ?? undefined,
        },
        seller: {
            name:    sellerDetail?.name ?? seller?.name,
            cpf:     sellerDetail?.cpf,
            cnpj:    sellerDetail?.cnpj,
            address: sellerDetail?.address,
            role:    sellerDetail?.role,
        },
        products: productDetails.map((p) => ({
            name:      p.name,
            variety:   p.variety,
            harvestAt: p.harvestAt,
            amount:    p.amount,
            unit:      p.unit,
            unitPrice: p.unitPrice,
        })),
        paymentMethod: payment?.method,
        total,
    };

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
                        {/* Header */}
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

                        {isExpanded && (
                            <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                                <ContractTemplate
                                    mode="read-only"
                                    preCheckoutData={preCheckoutData}
                                />
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.setItem("contractPreviewData", JSON.stringify(preCheckoutData));
                                    window.open("/contrato/preview", "_blank");
                                }}
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 underline text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Abrir documento completo (PDF)
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
