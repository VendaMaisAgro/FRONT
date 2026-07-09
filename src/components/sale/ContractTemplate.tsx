"use client";

import { useState, useEffect } from "react";
import type { SaleData } from "@/types/types";
import { calcAdjustedTotal } from "@/utils/functions";

const BLANK = "_______________________";

function val(v: unknown): string {
    if (v == null) return BLANK;
    const s = typeof v === "string" ? v : String(v);
    return s.trim() || BLANK;
}

function money(amount: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

function isoToInput(iso: string | null | undefined): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
}

function inputToDisplay(value: string): string {
    if (!value) return BLANK;
    const d = new Date(value + "T00:00:00");
    if (isNaN(d.getTime())) return BLANK;
    return d.toLocaleDateString("pt-BR");
}

function isoToDatetime(iso: string | null | undefined): string {
    if (!iso) return BLANK;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return BLANK;
    const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });
    const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
    return `${date}, ${time}h`;
}

function addDays(input: string, days: number): string {
    if (!input) return "";
    const d = new Date(input + "T00:00:00");
    if (isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContractContextData {
    contractNumber?: string | number;
    emissionDate?: string;
    buyer?: { name?: string; cpf?: string; cnpj?: string; doc?: string; email?: string; phone?: string; phone_number?: string };
    seller?: { name?: string; cpf?: string; cnpj?: string; doc?: string; address?: string; role?: string; email?: string };
    items?: Array<{ name?: string; product?: string; variety?: string; harvestAt?: string; amount?: number; quantity?: number; unit?: string; price?: number; unitPrice?: number; value?: number; total?: number }>;
    conditions?: { paymentMethod?: string; payment?: string; packagingType?: string; plannedHarvestDate?: string; harvestDate?: string; plannedPickupDate?: string; pickupDate?: string; plannedDeliveryDate?: string; deliveryDate?: string; actualDeliveryDate?: string; paymentConfirmedAt?: string; total?: number; totalValue?: number; value?: number };
    [key: string]: unknown;
}

/** Data provided directly in buyer-checkout mode (order not created yet) */
export interface PreCheckoutData {
    buyer?: { name?: string; cpf?: string; cnpj?: string };
    seller?: { name?: string; cpf?: string; cnpj?: string; address?: string; role?: string };
    products?: Array<{ name: string; variety?: string; harvestAt?: string; amount: number; unit: string; unitPrice: number }>;
    paymentMethod?: string;
    packagingType?: string;
    plannedHarvestDate?: string;
    plannedPickupDate?: string;
    plannedDeliveryDate?: string;
    total?: number;
}

// ─── Inline input styles ──────────────────────────────────────────────────────
const inlineInput = "border-0 border-b border-gray-400 bg-transparent focus:outline-none focus:border-green-600 text-sm px-1 min-w-[140px]";
const inlineCurrency = "border-0 border-b border-gray-400 bg-transparent focus:outline-none focus:border-green-600 text-sm px-1 min-w-[120px]";

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
    /** Seller-view: data from /contract/sale/:id/context API */
    data?: ContractContextData;
    /** Seller-view: raw SaleData from orders list */
    saleData?: SaleData;
    /** Buyer-checkout: pre-computed data from TermsStep */
    preCheckoutData?: PreCheckoutData;
    /**
     * "seller-edit"   (default) — dates + total editable
     * "buyer-checkout"          — packagingType + pickupDate + deliveryDate editable; total & harvest read-only
     * "read-only"               — all fields displayed as text, no inputs
     */
    mode?: "seller-edit" | "buyer-checkout" | "read-only";
    /** buyer-checkout: controlled packaging type */
    packagingType?: string;
    onPackagingTypeChange?: (v: string) => void;
    /** buyer-checkout: controlled pickup date (ISO input string yyyy-mm-dd) */
    pickupDate?: string;
    onPickupDateChange?: (v: string) => void;
    /** buyer-checkout: controlled delivery date (ISO input string yyyy-mm-dd) */
    deliveryDate?: string;
    onDeliveryDateChange?: (v: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ContractTemplate({
    data,
    saleData,
    preCheckoutData,
    mode = "seller-edit",
    packagingType: extPackagingType,
    onPackagingTypeChange,
    pickupDate: extPickupDate,
    onPickupDateChange,
    deliveryDate: extDeliveryDate,
    onDeliveryDateChange,
}: Props) {
    const isBuyerCheckout = mode === "buyer-checkout";
    const isReadOnly      = mode === "read-only";

    // ── Resolve buyer ──────────────────────────────────────────────────────
    const buyerName = preCheckoutData?.buyer?.name ?? data?.buyer?.name ?? saleData?.buyer?.name;
    const buyerDoc  = preCheckoutData?.buyer?.cpf  ?? preCheckoutData?.buyer?.cnpj
                   ?? data?.buyer?.cpf ?? data?.buyer?.cnpj ?? data?.buyer?.doc
                   ?? saleData?.buyer?.cpf;

    // ── Resolve seller ─────────────────────────────────────────────────────
    const firstBP   = saleData?.boughtProducts?.[0];
    const sellerName = preCheckoutData?.seller?.name ?? data?.seller?.name ?? firstBP?.product?.seller?.name;
    const sellerDoc  = preCheckoutData?.seller?.cpf  ?? preCheckoutData?.seller?.cnpj
                    ?? data?.seller?.cpf ?? data?.seller?.cnpj ?? data?.seller?.doc
                    ?? firstBP?.product?.seller?.cpf ?? firstBP?.product?.seller?.cnpj;
    const sellerAddr = preCheckoutData?.seller?.address || data?.seller?.address || undefined;
    const sellerRole = preCheckoutData?.seller?.role || data?.seller?.role || "";
    const isCooperative = sellerRole.includes("cooperative") || sellerRole.includes("distributor") || sellerRole.includes("association");

    // ── Resolve products ───────────────────────────────────────────────────
    type NormItem = { name?: string; variety?: string; harvestAt?: string; amount?: number; unit?: string; unitPrice?: number; total?: number };
    const effectiveItems: NormItem[] =
        preCheckoutData?.products
            ? preCheckoutData.products.map((p) => ({ name: p.name, variety: p.variety, harvestAt: p.harvestAt, amount: p.amount, unit: p.unit, unitPrice: p.unitPrice, total: p.amount * p.unitPrice }))
        : (data?.items ?? []).length > 0
            ? (data?.items ?? []).map((i) => ({ name: i.name ?? i.product, variety: i.variety, harvestAt: i.harvestAt, amount: i.amount ?? i.quantity, unit: i.unit, unitPrice: i.unitPrice ?? i.price, total: i.total ?? i.value }))
        : (saleData?.boughtProducts ?? []).map((bp) => {
              const unit   = bp.sellingUnitProduct?.unit?.unit ?? bp.sellingUnitProduct?.unit?.title ?? "un";
              const amount = Number(bp.amount);
              const value  = Number(bp.value);
              return { name: bp.product?.name, variety: bp.product?.variety, harvestAt: bp.product?.harvestAt ?? undefined, amount, unit, unitPrice: amount > 0 ? value / amount : value, total: value };
          });

    const productSummary = effectiveItems.map((p) => {
        const n = p.name ?? ""; return p.variety ? `${n} (${p.variety})` : n;
    }).filter(Boolean).join(", ") || BLANK;

    const totalAmountStr = effectiveItems.map((p) =>
        p.amount ? `${p.amount} ${p.unit ?? "un"}` : ""
    ).filter(Boolean).join(" + ") || BLANK;

    const unitPriceStr = effectiveItems.map((p) =>
        p.unitPrice != null ? `${money(Number(p.unitPrice))}/${p.unit ?? "un"}` : ""
    ).filter(Boolean).join(", ") || BLANK;

    // ── Resolve payment / packaging ────────────────────────────────────────
    // Use `|| undefined` so empty strings ("") also trigger the fallback, not just null/undefined
    const paymentMethod =
        preCheckoutData?.paymentMethod ||
        data?.conditions?.paymentMethod ||
        data?.conditions?.payment ||
        saleData?.paymentMethod?.method ||
        undefined;

    // ── Resolve total ──────────────────────────────────────────────────────
    const calcTotal = saleData ? calcAdjustedTotal(saleData) : null;
    const rawTotal  = preCheckoutData?.total ?? (data?.conditions?.total || data?.conditions?.totalValue || data?.conditions?.value || undefined) ?? calcTotal;
    const [totalValue, setTotalValue] = useState(rawTotal != null ? String(Number(rawTotal).toFixed(2)) : "");
    useEffect(() => {
        if (rawTotal != null) setTotalValue(String(Number(rawTotal).toFixed(2)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawTotal]);

    // ── Resolve harvest date ───────────────────────────────────────────────
    // Final fallback: harvestAt comes from saleData.boughtProducts[0].product.harvestAt
    const rawHarvestIso =
        preCheckoutData?.plannedHarvestDate ||
        data?.conditions?.plannedHarvestDate ||
        data?.conditions?.harvestDate ||
        effectiveItems[0]?.harvestAt ||
        saleData?.boughtProducts?.[0]?.product?.harvestAt ||
        "";
    const harvestInput = isoToInput(rawHarvestIso);

    // ── Editable dates (seller-edit only) ──────────────────────────────────
    const rawPickup   = isoToInput(preCheckoutData?.plannedPickupDate ?? data?.conditions?.plannedPickupDate ?? data?.conditions?.pickupDate ?? (saleData as Record<string, unknown>)?.plannedPickupDate as string | undefined);
    const rawDelivery = isoToInput(preCheckoutData?.plannedDeliveryDate ?? data?.conditions?.plannedDeliveryDate ?? data?.conditions?.deliveryDate ?? (saleData as Record<string, unknown>)?.plannedDeliveryDate as string | undefined);
    const rawActual   = isoToInput(data?.conditions?.actualDeliveryDate ?? saleData?.actualDeliveryDate);

    // Only the editable seller-edit step suggests harvest+15 as a starting point;
    // read-only previews and buyer-checkout must show blank until a date is actually set.
    const suggestDates = !isReadOnly && !isBuyerCheckout;

    const [harvestDate,    setHarvestDate]    = useState(harvestInput);
    const [sellerPickup,   setSellerPickup]   = useState(rawPickup   || (suggestDates && harvestInput ? addDays(harvestInput, 15) : ""));
    const [sellerDelivery, setSellerDelivery] = useState(rawDelivery || (suggestDates && harvestInput ? addDays(harvestInput, 15) : ""));
    const [actualDelivery, setActualDelivery] = useState(rawActual   || (suggestDates && harvestInput ? addDays(harvestInput, 15) : ""));

    useEffect(() => {
        if (harvestInput) {
            setHarvestDate(harvestInput);
            if (suggestDates) {
                const p7 = addDays(harvestInput, 15);
                if (!rawPickup)   setSellerPickup(p7);
                if (!rawDelivery) setSellerDelivery(p7);
                if (!rawActual)   setActualDelivery(p7);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [harvestInput]);

    function handleHarvestChange(v: string) {
        setHarvestDate(v);
        const p7 = v ? addDays(v, 15) : "";
        setSellerPickup(p7);
        setSellerDelivery(p7);
        setActualDelivery(p7);
    }

    // ── Dates displayed ────────────────────────────────────────────────────
    const displayHarvest  = harvestDate ? inputToDisplay(harvestDate) : (isBuyerCheckout ? inputToDisplay(isoToInput(effectiveItems[0]?.harvestAt)) : BLANK);
    const displayPickup   = isBuyerCheckout ? (extPickupDate   ? inputToDisplay(extPickupDate)   : BLANK) : (sellerPickup   ? inputToDisplay(sellerPickup)   : BLANK);
    const displayDelivery = isBuyerCheckout ? (extDeliveryDate ? inputToDisplay(extDeliveryDate) : BLANK) : (sellerDelivery ? inputToDisplay(sellerDelivery) : BLANK);

    // ── Contract number ────────────────────────────────────────────────────
    const contractNumber = data?.contractNumber ?? saleData?.orderNumber;
    const today = isoToDatetime(data?.emissionDate ?? saleData?.createdAt ?? new Date().toISOString());
    const totalDisplay = totalValue ? money(parseFloat(totalValue.replace(",", "."))) : BLANK;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4 text-sm leading-relaxed text-justify">
            <div className="flex justify-center pb-4 border-b border-gray-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-venda-mais.png" alt="Venda+ Agromarket" className="h-16 object-contain" />
            </div>

            <h2 className="text-center font-bold text-sm leading-snug uppercase">
                Contrato de Prestação de Serviços de Intermediação e Compra e Venda de Hortifrutigranjeiros
            </h2>

            <h3 className="font-bold text-sm">ANEXO I – QUADRO RESUMO (QR)</h3>
            <p className="text-xs italic text-gray-500">Este Anexo é parte integrante e indissociável do Contrato de Prestação de Serviços de Intermediação.</p>

            <div className="space-y-1">
                <p><strong>Número da Operação/Contrato:</strong> {contractNumber ? String(contractNumber) : BLANK}</p>
                <p><strong>Data de Emissão:</strong> {today}</p>
                <p><strong>INTERMEDIADORA:</strong> VENDAMAIS AGROMARKET BRASIL INOVA SIMPLES (I.S), CNPJ 62.591.442/0001-07, proprietária e operadora da marca e plataforma digital VENDA+ AGROMARKET, com sede à Rua Joaquim Bispo dos Santos, 56 – Bairro Santo Antonio – Juazeiro – Bahia. CEP 48903-190.</p>
                <p><strong>VENDEDOR (Nome/Razão Social):</strong> {val(sellerName)}</p>
                <p><strong>CNPJ/CPF:</strong> {val(sellerDoc)}</p>
                <p><strong>Endereço/Origem:</strong> {val(sellerAddr)}</p>
                <p><strong>Produto/Variedade:</strong> {productSummary}</p>
                <p><strong>Quantidade Total (Kg/Ton):</strong> {totalAmountStr}</p>
                {saleData?.cargoWeightKg && parseFloat(saleData.cargoWeightKg) > 0 && (
                    <p><strong>Peso Final Registrado (Balança):</strong> {saleData.cargoWeightKg} kg</p>
                )}
                <p><strong>Valor Unitário:</strong> {unitPriceStr}</p>
                <p>
                    <strong>Tipo de Embalagem:</strong>{" "}
                    {isBuyerCheckout && !isReadOnly ? (
                        <input
                            type="text"
                            value={extPackagingType ?? ""}
                            onChange={(e) => onPackagingTypeChange?.(e.target.value)}
                            placeholder="Ex: Caixa, Saco, Granel..."
                            className={inlineInput}
                        />
                    ) : val(extPackagingType ?? data?.conditions?.packagingType ?? preCheckoutData?.packagingType ?? saleData?.packagingType)}
                </p>
                <p>
                    <strong>Perfil do Vendedor:</strong>{" "}
                    PRODUTOR ({isCooperative ? " " : "✓"}){" "}
                    COOPERATIVA/ASSOCIAÇÃO/DISTRIBUIDOR ({isCooperative ? "✓" : " "})
                </p>
                <p><strong>COMPRADOR (Razão Social):</strong> {val(buyerName)}</p>
                <p><strong>CNPJ:</strong> {val(buyerDoc)}</p>
                <p><strong>Ficha Técnica:</strong> Conforme laudo ou especificação anexa.</p>
                <p><strong>Pesagem Obrigatória:</strong> SIM</p>
                <p>
                    <strong>Valor Total da Operação:</strong>{" "}
                    {!isBuyerCheckout && !isReadOnly ? (
                        <>
                            <input
                                type="number"
                                step="0.01"
                                value={totalValue}
                                onChange={(e) => setTotalValue(e.target.value)}
                                placeholder="0,00"
                                className={inlineCurrency}
                            />
                            {totalValue && <span className="ml-2 text-gray-500 text-xs">({totalDisplay})</span>}
                        </>
                    ) : (rawTotal != null ? money(Number(rawTotal)) : BLANK)}
                </p>
                <p><strong>Comissão de Intermediação (VENDAMAIS AGROMARKET):</strong> 5% do comprador e 3% do vendedor.</p>
                <p><strong>Condição de Pagamento:</strong> {val(paymentMethod)}</p>

                {/* Data de Colheita */}
                <p>
                    <strong>Data Prevista para Colheita/Disponibilização:</strong>{" "}
                    {!isBuyerCheckout && !isReadOnly ? (
                        <>
                            <input type="date" value={harvestDate} onChange={(e) => handleHarvestChange(e.target.value)} className={inlineInput} />
                            {harvestDate && <span className="ml-1 text-gray-500 text-xs">({inputToDisplay(harvestDate)})</span>}
                        </>
                    ) : displayHarvest}
                </p>

                {/* Data Retirada */}
                <p>
                    <strong>Data Prevista para Retirada/Embarque:</strong>{" "}
                    {isBuyerCheckout && !isReadOnly ? (
                        <>
                            <input
                                type="date"
                                value={extPickupDate ?? ""}
                                onChange={(e) => onPickupDateChange?.(e.target.value)}
                                className={inlineInput}
                            />
                            {extPickupDate && <span className="ml-1 text-gray-500 text-xs">({inputToDisplay(extPickupDate)})</span>}
                        </>
                    ) : !isReadOnly ? (
                        <>
                            <input type="date" value={sellerPickup} onChange={(e) => setSellerPickup(e.target.value)} className={inlineInput} />
                            {sellerPickup && <span className="ml-1 text-gray-500 text-xs">({displayPickup})</span>}
                        </>
                    ) : displayPickup}
                </p>

                {/* Data Entrega */}
                <p>
                    <strong>Data Prevista para Entrega no Destino:</strong>{" "}
                    {isBuyerCheckout && !isReadOnly ? (
                        <>
                            <input
                                type="date"
                                value={extDeliveryDate ?? ""}
                                onChange={(e) => onDeliveryDateChange?.(e.target.value)}
                                className={inlineInput}
                            />
                            {extDeliveryDate && <span className="ml-1 text-gray-500 text-xs">({inputToDisplay(extDeliveryDate)})</span>}
                        </>
                    ) : !isReadOnly ? (
                        <>
                            <input type="date" value={sellerDelivery} onChange={(e) => setSellerDelivery(e.target.value)} className={inlineInput} />
                            {sellerDelivery && <span className="ml-1 text-gray-500 text-xs">({displayDelivery})</span>}
                        </>
                    ) : displayDelivery}
                </p>

                {/* Data de Confirmação do Pagamento — exibida apenas quando disponível */}
                {data?.conditions?.paymentConfirmedAt && (
                    <p>
                        <strong>Pagamento Confirmado em:</strong>{" "}
                        {isoToDatetime(data.conditions.paymentConfirmedAt)}
                    </p>
                )}

                {/* Entrega efetiva — oculto no modo read-only para o comprador */}
                {!isBuyerCheckout && !isReadOnly && (
                    <p>
                        <strong>Entrega efetiva do produto:</strong>{" "}
                        <input type="date" value={actualDelivery} onChange={(e) => setActualDelivery(e.target.value)} className={inlineInput} />
                        {actualDelivery && <span className="ml-1 text-gray-500 text-xs">({inputToDisplay(actualDelivery)})</span>}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                <p><strong>Cláusula 1 – Do Objeto e Vinculação</strong></p>
                <p>O presente contrato tem por objeto a prestação de serviços de intermediação comercial digital por VENDAMAIS AGROMARKET, doravante denominada INTERMEDIADORA, visando a efetivação da compra e venda dos produtos hortifrutigranjeiros descritos no Anexo I entre o VENDEDOR e o COMPRADOR. O Anexo I é parte integrante deste contrato e, em caso de divergência entre os dados nele inseridos e o texto padrão das cláusulas, prevalecerão sempre os dados específicos do Anexo I.</p>

                <p><strong>Cláusula 2 – Da Intermediadora</strong></p>
                <p>A INTERMEDIADORA compromete-se a disponibilizar a plataforma digital para o acesso das partes, a formalização contratual, o processamento dos pagamentos por meio da Conta Escrow e a gestão documental da operação. A remuneração da INTERMEDIADORA será de 5% (cinco por cento) sobre o valor da operação, acrescido ao montante pago pelo COMPRADOR, e de 3% (três por cento) a ser deduzido do repasse ao VENDEDOR. Os valores de remuneração da INTERMEDIADORA serão lançados em Nota Fiscal de Serviço-NFS contra o COMPRADOR e VENDEDOR. A INTERMEDIADORA não detém a posse física dos produtos, atuando exclusivamente como facilitadora da transação comercial e financeira, não respondendo por vícios ocultos, salvo se comprovada falha em serviço de certificação contratado diretamente pela plataforma. Os percentuais remuneratórios poderão ser alterados a qualquer tempo pela INTERMEDIADORA, desde que com aviso prévio às partes com antecipação de 10 (dez) dias úteis.</p>

                <p><strong>Cláusula 3 – Das Obrigações das Partes</strong></p>
                <p>O COMPRADOR realiza o pagamento nos prazos ajustados, o transporte e o seguro da carga. O VENDEDOR emite Nota Fiscal idônea e garante a procedência lícita e sanitária dos produtos. Quando o VENDEDOR for Produtor Individual, a colheita, seleção e a embalagem são realizadas diretamente pelo COMPRADOR com supervisão do Certificador de Conformidade; quando o VENDEDOR for Cooperativa/Associação/Distribuidor, este entregará a mercadoria colhida, selecionada e embalada em conformidade com o ANEXO I.</p>
                <p>O VENDEDOR compromete-se a emitir a Nota Fiscal idônea contra o COMPRADOR antes da saída da mercadoria e garantir a procedência lícita e sanitária dos bens. O COMPRADOR compromete-se a realizar o pagamento nos prazos estabelecidos, responsabilizar-se integralmente pelo transporte e seguro da carga, e conferir a mercadoria no ato do recebimento no destino, observando os prazos de manifestação previstos neste contrato.</p>

                <p><strong>Cláusula 4 – Da Dinâmica de Pesagem e Fluxo Documental</strong></p>
                <p>A pesagem é condição obrigatória para todas as operações, devendo ser realizada em balança certificada pelo INMETRO. O motorista responsável efetuará a pesagem inicial (tara) e entregará o comprovante ao VENDEDOR, que acompanhará a pesagem final (bruto). O VENDEDOR deverá realizar o upload legível dos tickets de pesagem e da(s) Nota Fiscal(is) na plataforma em até duas horas após o carregamento. O status da carga somente será alterado para "Em Trânsito" após validação sistêmica dos documentos, sendo que a ausência de upload impede o início da contagem dos prazos de disponibilização e sujeita o VENDEDOR a sanções administrativas.</p>

                <p><strong>Cláusula 5 – Da Entrega, Recebimento e Aceite</strong></p>
                <p>A entrega efetiva da mercadoria no destino será considerada na data prevista no Anexo I, acrescida de um dia útil. Sendo o frete/transporte de responsabilidade do COMPRADOR, eventual atraso superior a esse prazo, por motivo de força maior, deverá ser comunicado imediatamente na plataforma através de email ou whatsapp; na ausência de comunicação, a entrega será tida por realizada. O COMPRADOR terá 6 (seis) horas após a chegada da carga para manifestar recusa ou avaria; o silêncio implicará em aceite tácito, tornando a obrigação de pagamento ao VENDEDOR líquida e exigível.</p>
                <p><strong>Parágrafo único</strong> – No ato da entrega prevista no Anexo I, o MOTORISTA e/ou COMPRADOR deverão, em até 6 (seis) horas, enviar ao canal oficial da INTERMEDIADORA o canhoto da Nota Fiscal contendo assinatura, data e hora e ressalvas, caso haja. A falta de envio nesse prazo, somada à ausência de comunicação de fato impeditivo, evidencia a realização da entrega e enseja o início dos efeitos de aceite e exigibilidade de pagamento previstos neste contrato.</p>

                <p><strong>Cláusula 6 – Do Pagamento e Conta Escrow</strong></p>
                <p>O pagamento será realizado pelo COMPRADOR conforme a modalidade escolhida no Anexo I – Quadro Resumo, mediante utilização obrigatória da Conta Escrow disponibilizada pela INTERMEDIADORA.</p>
                <p><strong>6.1. Operações com Produtor Individual</strong></p>
                <p>I – À vista: será exigido depósito integral (100%) do valor total da operação na Conta Escrow até 72 (setenta e duas) horas antes da data prevista para a colheita.</p>
                <p>II – A prazo: será exigida entrada mínima de 30% do valor total em Conta Escrow, devendo o saldo ser quitado em até 20 (vinte) dias, contados do aceite expresso ou tácito da mercadoria.</p>
                <p><strong>6.2. Operações com Cooperativa, Associação ou Distribuidor</strong></p>
                <p>I – À vista: o COMPRADOR deverá realizar depósito mínimo entre 10% e 30% do valor total em Conta Escrow até 72 (setenta e duas) horas antes da colheita, conforme definido no QR. O saldo remanescente deverá ser quitado integralmente na pesagem final do veículo e emissão da Nota Fiscal.</p>
                <p>II – A prazo: as parcelas terão seu vencimento iniciado na data do aceite, expresso ou tácito, seguindo o cronograma estabelecido no QR.</p>
                <p><strong>6.3. Inadimplência</strong></p>
                <p>O não pagamento na data de vencimento sujeitará o COMPRADOR a: (a) multa de 5% sobre o valor da obrigação; (b) juros de mora de 1% (um por cento) ao dia; (c) bloqueio imediato do cadastro na plataforma até integral regularização; e (d) possibilidade de negativação junto aos órgãos de proteção ao crédito.</p>
                <p><strong>6.4. Operações com Embarque em Finais de Semana e Feriados</strong></p>
                <p>Nas operações cuja data prevista para retirada/embarque descrita no Anexo I ocorra aos sábados, domingos ou feriados, o saldo remanescente da operação deverá ser integralmente depositado na Conta Escrow e quitado pelo COMPRADOR até as 20h (horário de Brasília) do dia útil imediatamente anterior.</p>
                <p><strong>Parágrafo único:</strong> A ausência de confirmação do pagamento no prazo estipulado neste item autoriza o VENDEDOR a reter a mercadoria e impedir o carregamento, sendo que o carregamento só será realizado após a compensação e quitação integral, correndo por conta e risco exclusivos do COMPRADOR eventuais prejuízos, custos com diárias de frete, falso frete ou deterioração do produto decorrentes deste atraso.</p>

                <p><strong>Cláusula 7 – Da Retenção da Mercadoria</strong></p>
                <p>O VENDEDOR somente disponibilizará a mercadoria para coleta após confirmação, pela INTERMEDIADORA, do depósito em Conta Escrow e da presença do Certificador de Conformidade no local designado (se for o caso) ou conforme Termo de Aditamento. Na ausência dos requisitos, a mercadoria permanece retida até regularização.</p>

                <p><strong>Cláusula 8 – Do Certificador de Conformidade</strong></p>
                <p>A contratação de Certificador de Conformidade independente poderá ser obrigatória ou opcional, conforme indicado no Anexo I – Quadro Resumo. Para operações em que o VENDEDOR seja Produtor Individual, a contratação do Certificador será, como regra geral, obrigatória, salvo dispensa excepcional, devidamente acordada entre COMPRADOR e VENDEDOR mediante Aditamento Contratual firmado digitalmente na plataforma da INTERMEDIADORA. Para operações em que o VENDEDOR seja Cooperativa, Associação ou Distribuidor, a certificação será opcional, porém recomendável, exceto quando expressamente indicada como obrigatória no Anexo I.</p>
                <p>Quando contratado, o Certificador será providenciado pelo COMPRADOR através da INTERMEDIADORA e terá como função auditar e certificar, no local de embarque, a conformidade dos produtos em relação às especificações técnicas e comerciais descritas no Anexo I. O custo deste serviço corresponderá a 1% (um por cento) do valor total da operação, respeitado o piso mínimo de R$ 200,00 (duzentos reais), sendo integralmente de responsabilidade do COMPRADOR. O laudo emitido pelo Certificador será documento essencial para a liberação dos valores retidos em Conta Escrow ao VENDEDOR.</p>

                <p><strong>Cláusula 9 – Do Aditamento Contratual</strong></p>
                <p>Qualquer condição ou ajuste não previsto neste instrumento poderá ser objeto de Aditamento Contratual, desde que formalizado exclusivamente pela plataforma da INTERMEDIADORA e assinado digitalmente pelas partes.</p>

                <p><strong>Cláusula 10 – Da Proteção de Dados (LGPD)</strong></p>
                <p>As partes se comprometem a cumprir integralmente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), responsabilizando-se pelo tratamento adequado das informações pessoais compartilhadas no âmbito deste contrato.</p>

                <p><strong>Cláusula 11 – Disposições Finais e Foro</strong></p>
                <p>As partes reconhecem a validade da assinatura eletrônica aposta neste contrato via plataforma. Para dirimir quaisquer dúvidas oriundas deste instrumento, elegem o foro da comarca de Juazeiro, Estado da Bahia, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
            </div>
        </div>
    );
}
