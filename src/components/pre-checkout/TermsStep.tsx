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

const BLANK = "_______________________";

function val(v: unknown): string {
    if (v == null) return BLANK;
    const s = typeof v === "string" ? v : JSON.stringify(v);
    return s.trim() || BLANK;
}

function money(amount: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return BLANK;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return BLANK;
    return d.toLocaleDateString("pt-BR");
}

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

const inlineInput = "border-0 border-b border-gray-400 bg-transparent focus:outline-none focus:border-green-600 text-sm px-1 min-w-[140px]";

export default function TermsStep() {
    const { control, watch } = useFormContext<PreCheckoutFormType>();
    const [isExpanded, setIsExpanded] = useState(false);
    const [buyer, setBuyer] = useState<FullUserData | null>(null);
    const [sellerDetail, setSellerDetail] = useState<SellerDetail | null>(null);
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

    // Campos editáveis pelo usuário
    const [packagingType, setPackagingType] = useState("");
    const [plannedPickupDate, setPlannedPickupDate] = useState("");
    const [plannedDeliveryDate, setPlannedDeliveryDate] = useState("");

    const { getSellers, orderValue, getProducts, setPackagingType: storeSetPackagingType } = useCheckoutStore();
    const sellers = getSellers();
    const seller = sellers[0];
    const storeProducts = getProducts();
    const payment = watch("payment");
    const total = orderValue();
    const today = new Date().toLocaleDateString("pt-BR");

    // Busca dados do comprador
    useEffect(() => {
        getUserData().then(setBuyer).catch(console.error);
    }, []);

    // Busca dados do vendedor
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

    // Busca detalhes dos produtos
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

    // Valores calculados
    const productSummary = productDetails.length > 0
        ? productDetails.map((p) => `${p.name}${p.variety ? ` (${p.variety})` : ""}`).join(", ")
        : BLANK;

    const totalAmountStr = productDetails.length > 0
        ? productDetails.map((p) => {
            const unit = p.unit || "un";
            return `${p.amount} ${unit}`;
        }).join(" + ")
        : BLANK;

    const unitPriceStr = productDetails.length > 0
        ? productDetails.map((p) => `${money(p.unitPrice)}/${p.unit || "un"}`).join(", ")
        : BLANK;

    const harvestAt = productDetails[0]?.harvestAt
        ? formatDate(productDetails[0].harvestAt)
        : BLANK;

    const sellerDoc = sellerDetail?.cnpj || sellerDetail?.cpf;
    const buyerDoc = buyer?.cnpj || buyer?.cpf;

    const sellerRole = sellerDetail?.role ?? "";
    const isCooperative = sellerRole.includes("cooperative") || sellerRole.includes("distributor") || sellerRole.includes("association");

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
                        {/* Cabeçalho */}
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
                                <div className="prose prose-sm max-w-none text-gray-700 space-y-4">

                                    {/* Logo */}
                                    <div className="flex justify-center pb-4 border-b border-gray-300">
                                        <img src="/logo-venda-mais.png" alt="Venda+ Agromarket" className="h-16 object-contain" />
                                    </div>

                                    <h2 className="text-center font-bold text-sm leading-snug uppercase">
                                        Contrato de Prestação de Serviços de Intermediação e Compra e Venda de Hortifrutigranjeiros
                                    </h2>

                                    <h3 className="font-bold text-sm">ANEXO I – QUADRO RESUMO (QR)</h3>
                                    <p className="text-xs italic text-gray-500">Este Anexo é parte integrante e indissociável do Contrato de Prestação de Serviços de Intermediação.</p>

                                    <div className="space-y-1 text-sm">
                                        <p><strong>Número da Operação/Contrato:</strong> {BLANK}</p>
                                        <p><strong>Data de Emissão:</strong> {today}</p>
                                        <p><strong>INTERMEDIADORA:</strong> VENDAMAIS AGROMARKET BRASIL INOVA SIMPLES (I.S), CNPJ 62.591.442/0001-07, proprietária e operadora da marca e plataforma digital VENDA+ AGROMARKET, com sede à Rua Joaquim Bispo dos Santos, 56 – Bairro Santo Antonio – Juazeiro – Bahia. CEP 48903-190.</p>
                                        <p><strong>VENDEDOR (Nome/Razão Social):</strong> {val(sellerDetail?.name ?? seller?.name)}</p>
                                        <p><strong>CNPJ/CPF:</strong> {val(sellerDoc)}</p>
                                        <p><strong>Endereço/Origem:</strong> {val(sellerDetail?.address)}</p>
                                        <p><strong>Produto/Variedade:</strong> {productSummary}</p>
                                        <p><strong>Quantidade Total (Kg/Ton):</strong> {totalAmountStr}</p>
                                        <p><strong>Valor Unitário:</strong> {unitPriceStr}</p>
                                        <p>
                                            <strong>Tipo de Embalagem:</strong>{" "}
                                            <input
                                                type="text"
                                                value={packagingType}
                                                onChange={(e) => { setPackagingType(e.target.value); storeSetPackagingType(e.target.value); }}
                                                placeholder="Ex: Caixa, Saco, Granel..."
                                                className={inlineInput}
                                            />
                                        </p>
                                        <p>
                                            <strong>Perfil do Vendedor:</strong>{" "}
                                            PRODUTOR ({isCooperative ? " " : "✓"}){" "}
                                            COOPERATIVA/ASSOCIAÇÃO/DISTRIBUIDOR ({isCooperative ? "✓" : " "})
                                        </p>
                                        <p><strong>COMPRADOR (Razão Social):</strong> {val(buyer?.name)}</p>
                                        <p><strong>CNPJ:</strong> {val(buyerDoc)}</p>
                                        <p><strong>Ficha Técnica:</strong> Conforme laudo ou especificação anexa.</p>
                                        <p><strong>Pesagem Obrigatória:</strong> SIM</p>
                                        <p><strong>Valor Total da Operação:</strong> {total > 0 ? money(total) : BLANK}</p>
                                        <p><strong>Comissão de Intermediação (VENDAMAIS AGROMARKET):</strong> 5% do comprador e 3% do vendedor.</p>
                                        <p><strong>Condição de Pagamento:</strong> {val(payment?.method)}</p>
                                        <p><strong>Data Prevista para Colheita/Disponibilização:</strong> {harvestAt}</p>
                                        <p>
                                            <strong>Data Prevista para Retirada/Embarque:</strong>{" "}
                                            <input
                                                type="date"
                                                value={plannedPickupDate}
                                                onChange={(e) => setPlannedPickupDate(e.target.value)}
                                                className={inlineInput}
                                            />
                                        </p>
                                        <p>
                                            <strong>Data Prevista para Entrega no Destino:</strong>{" "}
                                            <input
                                                type="date"
                                                value={plannedDeliveryDate}
                                                onChange={(e) => setPlannedDeliveryDate(e.target.value)}
                                                className={inlineInput}
                                            />
                                        </p>
                                        <p><strong>Entrega efetiva do produto:</strong> {BLANK}</p>
                                    </div>

                                    <div className="space-y-3 text-sm leading-relaxed">

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
                                        <p><strong>Parágrafo primeiro</strong> – Da dispensa excepcional para Produtor Individual: Caso o COMPRADOR e o VENDEDOR (Produtor Individual) optem, em caráter extraordinário, pela não contratação do Certificador de Conformidade, essa dispensa deverá ser formalizada por Aditamento Contratual, firmado digitalmente na plataforma da INTERMEDIADORA. Nessa hipótese, as partes reconhecem e concordam que a conferência da mercadoria será atestada no carregamento e que implicará ACEITE TÁCITO, sem direito a controvérsias futuras quanto à conformidade dos produtos.</p>
                                        <p><strong>Parágrafo segundo</strong> – Da operação sem certificação: Quando se tratar de operação com Cooperativa/Associação/Distribuidor e o Certificador não tiver sido contratado, a conferência da mercadoria será realizada no destino final, seguindo padrão já definido neste contrato.</p>
                                        <p><strong>Parágrafo terceiro</strong> – Da responsabilidade técnica: O Certificador de Conformidade responderá civilmente por eventuais prejuízos decorrentes de laudo emitido em desacordo com as especificações técnicas, sem prejuízo da responsabilidade primária do VENDEDOR quanto à qualidade dos produtos. Havendo contestação fundamentada, caberá à INTERMEDIADORA instaurar procedimento de mediação, podendo a parte prejudicada buscar ressarcimento diretamente contra o Certificador.</p>
                                        <p><strong>Parágrafo quarto</strong> – Da deterioração ou risco iminente de perda: Em razão da natureza perecível dos hortifrutigranjeiros, na hipótese de divergência não solucionada nos prazos contratuais e ocorrendo deterioração ou risco iminente de perda da carga, esta será imediatamente destinada a: (i) doação social, quando própria para consumo humano; (ii) processamento industrial, quando tecnicamente viável; ou (iii) descarte sanitário, quando imprópria para consumo ou processamento. A destinação será realizada pela parte que detiver a posse física da carga, devendo documentar integralmente o destino final e os respectivos custos, mediante registro fotográfico, identificação do lote e apresentação de documentos legais de descarte, doação ou processamento.</p>
                                        <p><strong>Parágrafo quinto</strong> – Da responsabilidade financeira: A responsabilidade financeira decorrente da destinação será atribuída à parte que tiver dado causa à não conformidade, conforme apuração realizada pela INTERMEDIADORA. Após a destinação final, o produto será considerado perdido, inexistindo possibilidade de restituição ou indenização além da imputação da responsabilidade prevista neste contrato.</p>

                                        <p><strong>Cláusula 9 – Do Aditamento Contratual</strong></p>
                                        <p>Qualquer condição ou ajuste não previsto neste instrumento poderá ser objeto de Aditamento Contratual, desde que formalizado exclusivamente pela plataforma da INTERMEDIADORA e assinado digitalmente pelas partes.</p>
                                        <p>Os aditamentos passam a integrar este contrato para todos os fins, produzindo efeitos imediatos após sua validação.</p>
                                        <p>Os aditamentos deverão ser registrados no mínimo 72 (setenta e duas) horas antes da execução da operação, para produzir seus fins jurídicos.</p>

                                        <p><strong>Cláusula 10 – Da Proteção de Dados (LGPD)</strong></p>
                                        <p>As partes se comprometem a cumprir integralmente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), responsabilizando-se pelo tratamento adequado das informações pessoais compartilhadas no âmbito deste contrato. As partes declaram ciência de que seus dados serão tratados conforme a Política de Privacidade da plataforma VENDAMAIS AGROMARKET, autorizando o compartilhamento das informações estritamente necessárias (como localização e contato) com o Certificador de Conformidade ou outros prestadores de serviço vinculados à operação, exclusivamente para execução da transação contratada.</p>

                                        <p><strong>Cláusula 11 – Disposições Finais e Foro</strong></p>
                                        <p>As partes reconhecem a validade da assinatura eletrônica aposta neste contrato via plataforma. Para dirimir quaisquer dúvidas oriundas deste instrumento, elegem o foro da comarca de Juazeiro, Estado da Bahia, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>

                                    </div>

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
