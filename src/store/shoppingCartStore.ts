import { CartItemsContextType } from "@/types/types";
import { create } from "zustand";

type ShoppingCartStore = {
	products: CartItemsContextType[];
	amount: number;
	setProducts: (products: CartItemsContextType[]) => void;
	addNewProduct: (product: CartItemsContextType) => void;
	removeProduct: (product: CartItemsContextType) => void;
	// changeProductAmount: (id: number, type: "increase" | "decrease") => void;
};

export const useShoppingCartStore = create<ShoppingCartStore>((set) => ({
	products: [],
	amount: 0,
	setProducts: (products) =>
		set(() => {
			return { products: products || [], amount: products.length };
		}),
	addNewProduct: (product) =>
		set((state: { products: CartItemsContextType[]; amount: number }) => {
			const matchingIndex = state.products.findIndex(
				(p) =>
					p.productId === product.productId &&
					p.sellingUnitProductId === product.sellingUnitProductId
			);
			if (matchingIndex >= 0) {
				return {
					products: state.products,
					amount: state.amount,
				};
			}
			return {
				products: [...state.products, product],
				amount: state.amount + 1,
			};
		}),
	removeProduct: (product) =>
		set((state: { products: CartItemsContextType[]; amount: number }) => ({
			products: state.products.filter(
				(p) =>
					p.productId !== product.productId &&
					p.sellingUnitProductId !== product.sellingUnitProductId
			),
			amount: state.amount - 1,
		})),
	//TODO: implementar quando houver endpoint
	// changeProductAmount: (id, type) =>
	// 	set((state: { products: IProduct[] }) => {
	// 		const matchingIndex = state.products.findIndex((p) => p.productId === id);

	// 		return {
	// 			products: state.products.map((p, _) => {
	// 				if (_ === matchingIndex) {
	// 					return {
	// 						...p,
	// 						amount: type === "increase" ? p.amount + 1 : p.amount - 1,
	// 					};
	// 				}
	// 				return p;
	// 			}),
	// 		};
	// 	}),
}));
