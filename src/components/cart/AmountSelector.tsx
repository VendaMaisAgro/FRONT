import { LoaderCircle, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface AmountSelectorProps {
	amount: number;
	increaseHandler: () => void;
	decreaseHandler: () => void;
	changeHandler?: (amount: number) => void;
	loading?: boolean;
}

export default function AmountSelector({
	amount,
	increaseHandler,
	decreaseHandler,
	changeHandler,
	loading = false,
}: AmountSelectorProps) {
	const [inputValue, setInputValue] = useState(String(amount));

	useEffect(() => {
		setInputValue(String(amount));
	}, [amount]);

	function commitValue() {
		const parsed = Number(inputValue);

		if (!inputValue || parsed < 1) {
			setInputValue(String(amount));
			return;
		}

		if (parsed !== amount) {
			changeHandler?.(parsed);
		}
	}

	return (
		<div className="flex items-center border rounded-md px-1 xl:px-2">
			<button
				onClick={decreaseHandler}
				className="p-1 text-zinc-600 cursor-pointer rounded-full hover:bg-zinc-950/10 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
				disabled={amount <= 1 || loading}
			>
				<Minus size={16} />
			</button>

			{loading ? (
				<div className="px-2 py-1 text-center min-w-[3px] xl:min-w-[40px] text-md">
					<LoaderCircle className="animate-spin text-primary" />
				</div>
			) : (
				<input
					type="text"
					inputMode="numeric"
					value={inputValue}
					onChange={(e) =>
						setInputValue(e.target.value.replace(/\D/g, ''))
					}
					onBlur={commitValue}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.currentTarget.blur();
						}
					}}
					readOnly={!changeHandler}
					className="px-2 py-1 text-center min-w-[3px] xl:min-w-[40px] w-10 text-md bg-transparent focus:outline-none"
				/>
			)}

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
