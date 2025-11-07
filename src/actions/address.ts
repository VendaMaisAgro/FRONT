"use server";

import { AddressFormValues } from "@/lib/schemas";
import { verifySession } from "@/lib/session";
import { Address } from "@/types/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getAddresses(): Promise<Address[]> {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	const { jwt, id } = await verifySession(token);

	const res = await fetch(`${process.env.API_URL}/address/user/${id}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		cache: "no-store",
	});

	if (!res.ok) {
		console.error("Erro ao buscar endereços:", res.statusText);
		return [];
	}

	return await res.json();
}

export async function getAddressById(id: string): Promise<Address> {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	const { jwt, id: userId } = await verifySession(token);

	const res = await fetch(`${process.env.API_URL}/address/user/${userId}`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Erro ao buscar endereços.");
	}

	const addresses = await res.json();

	const addressFound = addresses.find(
		(addr: { id: number }) => String(addr.id) === String(id)
	);

	if (!addressFound) {
		throw new Error("Endereço não encontrado.");
	}

	return {
		...addressFound,
		number: addressFound.number.toString(),
	};
}

export async function deleteAddress(addressId: string): Promise<boolean> {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	const { jwt } = await verifySession(token);

	try {
		const res = await fetch(`${process.env.API_URL}/address/${addressId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			cache: "no-store",
		});

		if (!res.ok) {
			console.error("Erro ao excluir endereço:", res.status, await res.text());
			return false;
		}

		revalidatePath("/market/profile/personal-info/addresses");

		return true;
	} catch (error) {
		console.error("Erro na deleteAddress:", error);
		return false;
	}
}

export async function editAddress(id: string, data: AddressFormValues) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	const { jwt } = await verifySession(token);

	const res = await fetch(`${process.env.API_URL}/address/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		console.error("Erro ao editar endereço:", await res.text());
		throw new Error("Falha ao editar endereço.");
	}

	return await res.json();
}

export async function createAddress(data: AddressFormValues) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	const { jwt, id } = await verifySession(token);

	const res = await fetch(`${process.env.API_URL}/address/${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		console.error("Erro ao criar endereço:", await res.text());
		throw new Error("Falha ao criar endereço.");
	}

	return await res.json();
}

export async function setNewDefaultAddress(id: string, addressAlias: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	const { jwt, id: userId } = await verifySession(token);

	const payload = { userId };

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_URL}/api/address/set-default/${id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(payload),
		}
	);

	if (!res.ok) {
		return {
			sucess: false,
			message: res.statusText,
		};
	}

	revalidatePath("/market/profile/personal-info/addresses");

	return {
		sucess: true,
		message: `Sucesso! ${addressAlias} é seu novo endereço padrão.`,
	};
}
