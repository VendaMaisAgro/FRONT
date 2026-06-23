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

export interface ContractParty {
	name?: string;
	cpf?: string | null;
	cnpj?: string | null;
	address?: string;
	role?: string;
}

export interface ContractItem {
	productId: string;
	name: string;
	variety?: string;
	harvestAt?: string;
	amount: number;
	unit: string;
	unitPrice: number;
	packagingType?: string;
}

export interface ContractConditions {
	paymentMethod?: string;
	total?: number;
	plannedHarvestDate?: string;
	plannedPickupDate?: string;
	plannedDeliveryDate?: string;
}

/** Snapshot collected in TermsStep; sent to POST /contract/accept after sale creation */
export interface ContractSnapshot {
	buyer?: ContractParty;
	seller?: ContractParty;
	items?: ContractItem[];
	conditions?: ContractConditions;
}

interface CheckoutState {
	data: OrderData | null;
	packagingType: string;
	contractSnapshot: ContractSnapshot;
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
	setContractSnapshot: (snapshot: ContractSnapshot) => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
	data: null,
	packagingType: "",
	contractSnapshot: {},
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
			? data.sellersData.map((o) => ({ id: o.sellerId, name: o.sellerName }))
			: [];
	},
	getProducts() {
		const { data } = get();
		return data ? data.products : [];
	},
	setCheckoutData: (data) => set(() => ({ data: data ?? null })),
	setPackagingType: (type) => set(() => ({ packagingType: type })),
	setContractSnapshot: (snapshot) => set(() => ({ contractSnapshot: snapshot })),
}));
