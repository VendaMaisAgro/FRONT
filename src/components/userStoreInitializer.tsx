"use client";

import { useShoppingCartStore } from "@/store/shoppingCartStore";
import { useUserStore } from "@/store/userInfoStore";
import { CartItemsContextType } from "@/types/types";
import { useRef } from "react";


interface StoreInitializerProps {
	user: { id: string; email: string; name: string; img?: string | null; role?: string | null } | null;
	cart: CartItemsContextType[];
}

function StoreInitializer({ user, cart }: StoreInitializerProps) {
	const initialized = useRef(false);
	const { setUser } = useUserStore();
	const { setProducts } = useShoppingCartStore();

	if (!initialized.current) {
		setUser(user);
		setProducts(cart);
		initialized.current = true;
	}

	return null;
}

export default StoreInitializer;
