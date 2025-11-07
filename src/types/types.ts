export type Product = {
	id: string;
	name: string;
	category: string;
	variety: string;
	price: number;
	stock: number;
	description: string;
	harvestAt: string;
	createdAt: string;
	isNegotiable: boolean;
	sellerId: string;
	sellingUnitsProduct: {
		unitId: string;
		minPrice: number;
	}[];
	images_Path: string[];
};

export type SellerGroup = {
	sellerId: string;
	sellerName: string;
	sellerProducts: CartDataProduct[];
};

export type UserPayload = {
	id: string;
	role: string;
	exp: number;
	jwt: string;
	email: string;
	name: string;
};

export type SignInFormState = {
	message: string;
	errors?: {
		[key: string]: string[] | undefined;
	};
};

export type Address = {
	id: string;
	userId: number;
	alias: string;
	street: string;
	cep: string;
	uf: string;
	city: string;
	number: string;
	complement: string;
	addressee: string;
	phone_number_addressee: string;
	referencePoint: string;
	default?: boolean;
};

export type IbgeApiUf = {
	id: number;
	sigla: string;
	nome: string;
};

export type IbgeApiCity = {
	id: number;
	nome: string;
};

export type UnitData = {
	id: string;
	unit: string;
	title: string;
};

type SellingUnitProduct = {
	id: string;
	unitId: string;
	minPrice: number;
	productId: string;
	unit: UnitData;
};

export type CartDataProduct = {
	id: string;
	cartId: string;
	productId: string;
	sellingUnitProductId: string;
	amount: number;
	value: number;
	product: {
		id: string;
		name: string;
		description: string;
		images_Path: string;
		seller: {
			id: string;
			name: string;
		};
	};
	sellingUnitProduct: SellingUnitProduct;
};

//! usando isso por enquanto o backend nao manda os produtos do carrinho organizados por vendedor
export type FormattedCartData = {
	sellerId: string;
	sellerName: string;
	products: CartDataProduct[];
};

export type CartDataType = {
	id: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	user: { id: string; name: string };
	items: CartDataProduct[];
};

export type CartItemsContextType = {
	productId: string;
	sellingUnitProductId: string;
};

export type ProductToCart = {
	userId: string;
	productId: string;
	sellingUnitProductId: string;
	amount: number;
	value: number;
};

export type ProductToApi = {
	name: string;
	variety: string;
	category: string;
	stock: number;
	description: string;
	harvestAt: Date;
	isNegotiable: boolean;
	sellingUnitsProduct: {
		unitId: string;
		minPrice: number;
	}[];
};

export type SellerProductList = {
	id: string;
	name: string;
	category: string;
	variety: string;
	images_Path: string[];
	harvestAt: string;
	isNegotiable: boolean;
	createdAt: string;
	sellingUnitsProduct: SellingUnitProduct[];
};

export type MarketProductCardType = {
	id: string;
	name: string;
	sellingUnitsProduct: Omit<
		SellingUnitProduct,
		'id' | 'productId' | 'unitId'
	>[];
	images_Path: string[];
	seller?: {
		name: string;
	};
};

export type TransportTypeData = {
	id: string;
	type: string;
	valueFreight: number;
};

export type PaymentMethodsData = {
	id: string;
	method: string;
};

export type OrderStatus = 'new' | 'processing' | 'pickup' | 'completed';

export type OrderAction = 'accepted' | 'rejected' | null;

export type Order = {
	id: string;
	buyer: string;
	product: string;
	description?: string;
	value: number; // in BRL
	payment: string;
	status: OrderStatus;
	action?: OrderAction; // Nova propriedade para controlar se foi aceito/recusado
};

// Tipos para a API de vendas
export type SaleBuyer = {
	id: string;
	name: string;
	email: string;
	phone_number: string;
	cpf: string | null;
};

export type SaleProduct = {
	id: string;
	name: string;
	category: string;
	variety: string;
	description: string;
	images_Path: string[];
	productRating: number;
	sellerId: string;
	seller: {
		id: string;
		name: string;
		email: string;
		phone_number: string;
	};
};

export type SaleUnit = {
	id: string;
	unit: string;
	title: string;
};

export type SaleSellingUnitProduct = {
	id: string;
	minPrice: number;
	unitId: number;
	unit: SaleUnit;
};

export type SaleBoughtProduct = {
	id: string;
	productId: string;
	sellingUnitProductId: string;
	value: number;
	amount: number;
	saleDataId: string;
	product: SaleProduct;
	sellingUnitProduct: SaleSellingUnitProduct;
};

export type SaleShippingAddress = {
	id: string;
	addressee: string;
	phone_number_addressee: string;
	street: string;
	number: string;
	complement: string;
	city: string;
	uf: string;
	cep: string;
};

export type SalePaymentMethod = {
	id: string;
	method: string;
};

export type SaleTransportType = {
	id: string;
	type: string;
	valueFreight: number;
};

export type SaleData = {
	id: string;
	transportTypeId: string;
	createdAt: string;
	shippedAt: string;
	arrivedAt: string;
	transportValue: number;
	productRating: number;
	sellerRating: number;
	status: string;
	addressId: string;
	paymentMethodId: string;
	buyerId: string;
	paymentCompleted: boolean;
	buyer: SaleBuyer;
	boughtProducts: SaleBoughtProduct[];
	shippingAddress: SaleShippingAddress;
	paymentMethod: SalePaymentMethod;
	transportType: SaleTransportType;
};

export type SalesApiResponse = {
	message: string;
	totalSales: number;
	totalValue: number;
	sales: SaleData[];
};

export type ProductFromSeller = Pick<
	Product,
	'id' | 'name' | 'category' | 'variety' | 'images_Path'
> & {
	sellingUnitsProduct: SellingUnitProduct[];
};

export type SellerHeaderData = {
	name: string;
	img?: string;
};

export interface SellerProfileClientProps {
	sellerId: string;
}

export type FormImage = File | string;

export type SellingUnit = {
	id: string;
	title: string;
	unit: string;
};

// export type EditProductFormData = {
// 	name: string;
// 	category: string;
// 	variety: string;
// 	description: string;
// 	stock: number;
// 	harvestAt: Date;
// 	isNegotiable: boolean;
// 	productRating: number;
// 	ratingAmount: number;
// 	ratingStarAmount: number[];
// 	amountSold: number;
// 	images_Path: string[];
// 	images: string[];
// 	;
// };
