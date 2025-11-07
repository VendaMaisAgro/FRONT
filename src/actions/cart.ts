"use server";

import { verifySession } from "@/lib/session";
import { ProductToCart } from "@/types/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserCartData() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session")?.value;
	const { id } = await verifySession(sessionCookie);

	const cartRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${id}`, {
		headers: { Cookie: `session=${sessionCookie}` },
	});
	if (!cartRes.ok) redirect("/login");
	const cart = await cartRes.json();

	return cart;
}

export async function addProductToCart(payload: ProductToCart) {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session")?.value;
	await verifySession(sessionCookie);

	const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart`, {
		method: "POST",
		headers: { Cookie: `session=${sessionCookie}` },
		body: JSON.stringify(payload),
	});

	return { success: res.ok };
}

export async function removeItemFromCart(id: string) {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session")?.value;
	await verifySession(sessionCookie);

	const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${id}`, {
		method: "DELETE",
		headers: { Cookie: `session=${sessionCookie}` },
	});

	if (res.ok) {
		revalidatePath("/market/cart");
	}

	return { success: res.ok };
}

export async function changeCartProductAmount(
	id: string,
	payload: { amount: number; value: number }
) {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session")?.value;
	const { jwt } = await verifySession(sessionCookie);

	const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${id}`, {
		method: "PUT",
		headers: { Authorization: `Bearer ${jwt}` },
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	if (res.ok) {
		revalidatePath("/market/cart");

		return { ok: res.ok, message: data.message };
	}

	return { ok: false, message: data.message };
}
