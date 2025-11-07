import { LoaderCircle, Minus, Plus } from "lucide-react";

interface AmountSelectorProps {
	amount: number;
	increaseHandler: () => void;
	decreaseHandler: () => void;
	loading?: boolean;
}

export default function AmountSelector({
	amount,
	increaseHandler,
	decreaseHandler,
	loading = false,
}: AmountSelectorProps) {
	return (
		<div className="flex items-center border rounded-md px-1 xl:px-2">
			<button
				onClick={decreaseHandler}
				className="p-1 text-zinc-600 cursor-pointer rounded-full hover:bg-zinc-950/10 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
				disabled={amount <= 1 || loading}
			>
				<Minus size={16} />
			</button>

			<div className="px-2 py-1 text-center min-w-[3px] xl:min-w-[40px] text-md">
				{loading ? (
					<LoaderCircle className="animate-spin text-primary" />
				) : (
					<span>{amount}</span>
				)}
			</div>

			<button
				onClick={increaseHandler}
				className="p-1 text-zinc-600 cursor-pointer rounded-full hover:bg-zinc-950/10 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
				disabled={loading}
			>
				<Plus size={16} />
			</button>
		</div>
	);
}
