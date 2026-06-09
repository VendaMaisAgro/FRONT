import { create } from 'zustand';

interface OrderData {
	sellersData: {
		sellerId: string;
		sellerName: string;
	}[];
	products: {
		productId: string;
		sellingUnitProductId: string;
		value: number;
		amount: number;
	}[];
	total: number;
}

interface CheckoutState {
	data: OrderData | null;
	packagingType: string;
	productsAmount: () => number;
	orderValue: () => number;
	getSellers: () => { id: string; name: string }[];
	getProducts: () => {
		productId: string;
		sellingUnitProductId: string;
		value: number;
		amount: number;
	}[];
	setCheckoutData: (data: OrderData) => void;
	setPackagingType: (type: string) => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
	data: null,
	packagingType: "",
	productsAmount: () => {
		const { data } = get();

		return data ? data.products.length : 0;
	},
	orderValue() {
		const { data } = get();

		return data ? data.total : 0;
	},
	getSellers() {
		const { data } = get();

		return data
			? data.sellersData.map((o) => ({
					id: o.sellerId,
					name: o.sellerName,
			  }))
			: [];
	},
	getProducts() {
		const { data } = get();

		return data ? data.products : [];
	},
	setCheckoutData: (data) =>
		set(() => ({
			data: data || [],
		})),
	setPackagingType: (type) => set(() => ({ packagingType: type })),
}));
