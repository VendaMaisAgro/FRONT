"use server";
import { getAllFromSeller } from "@/actions/product";
import { SellerProductList } from "@/types/types";
import ProductListClient from "./productList";

export default async function Products() {
	const products: SellerProductList[] = await getAllFromSeller();

	return <ProductListClient initialProducts={products} />;
}
