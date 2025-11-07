import { suggestPrice } from "@/actions/product";
import { moneyMask } from "@/utils/functions";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function PriceRecommendation({
	productName,
}: {
	productName: string;
}) {
	const [suggested, setSuggested] = useState<number | null>(null);

	async function getSuggestedPrice(productName: string) {
		if (!productName || productName.length <= 3) {
			return;
		}

		const res = await suggestPrice(productName);

		if (res.success) {
			return setSuggested(res.data.suggestedPrice);
		}
		return setSuggested(null);
	}

	useEffect(() => {
		const debounceTimeout = setTimeout(() => {
			getSuggestedPrice(productName);
		}, 500);

		return () => clearTimeout(debounceTimeout);
	}, [productName]);

	return (
		<div className="flex gap-1 items-center text-black">
			{suggested === null && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Info className="text-red-600" size={18} />
					</TooltipTrigger>
					<TooltipContent>
						<p>
							Não encontramos os preços mais atualizados para o produto, tente
							um título mais detalhado.
						</p>
					</TooltipContent>
				</Tooltip>
			)}
			<span>Preço recomendado:</span>
			{suggested != null ? (
				<span className="text-primary font-semibold">
					{moneyMask(suggested)}/kg
				</span>
			) : (
				<>
					<span className="text-gray-500 italic">R$ --.--</span>
				</>
			)}
		</div>
	);
}
