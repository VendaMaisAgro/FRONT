import { getUserCartData } from '@/actions/cart';
import { CartDataType } from '@/types/types';
import CartData from './components/cart-data';

export default async function Cart() {
	const products: { data: CartDataType } = await getUserCartData();

	return (
		<section className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Carrinho de produtos</h1>
			<CartData products={products.data?.items || []} />
		</section>
	);
}
