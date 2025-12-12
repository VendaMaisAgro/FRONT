"use server";

import { CreateProductSchemaType } from "@/lib/schemas";
import { verifySession } from "@/lib/session";
import { ProductToApi } from "@/types/types";
import { mapProductDataToFormData } from "@/utils/mappers/mapProductDataToFormData";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_URL;
const api = "http://localhost:5000";

export async function createProduct(values: CreateProductSchemaType) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	const { id } = await verifySession(token);

	const formData = mapProductDataToFormData(values);
	formData.append("sellerId", id.toString());

	try {
		const res = await fetch(`${apiUrl}/api/sellerProducts`, {
			method: "POST",
			headers: { Cookie: `session=${token}` },
			body: formData,
		});

		if (res.ok) {
			return { status: res.status };
		}
		return {
			status: res.status,
		};
	} catch (err) {
		console.error("Erro no fetch", err);
		return {
			error: err,
		};
	}
}

export async function readProductById(id: string) {
	const cookieStore = await cookies();
	const session = cookieStore.get("session")?.value;
	await verifySession(session);

	const res = await fetch(`${apiUrl}/api/sellerProducts/${id}`, {
		method: "GET",
		headers: {
			Cookie: `session=${session}`,
		},
	});

	if (!res.ok) {
		console.error(`Erro ao buscar produto ${id}: ${res.statusText}`);
		return null;
	}

	return await res.json();
}

//TODO: melhorar tratamento de erros
export async function suggestPrice(productName: string) {
	if (!productName) {
		return { success: false, message: "O nome do produto é obrigatório" };
	}

	const url = `${api}/price-recommendations/${encodeURIComponent(productName)}`;

	const res = await fetch(url, {
		method: "GET",
		cache: "no-store",
	});

	if (!res.ok) {
		console.error(res);
		return {
			success: false,
			message: "Não foi possível buscar os dados do produto.",
		};
	}

	const { data } = await res.json();
	return {
		success: true,
		message: "Dados recuperados com sucesso.",
		data: data,
	};
}
export async function removeProductAction(id: string): Promise<boolean> {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	if (!token) {
		redirect("/login");
	}

	try {
		const res = await fetch(`${apiUrl}/api/sellerProducts/${id}`, {
			method: "DELETE",
			headers: {
				Cookie: `session=${token}`,
			},
		});

		if (!res.ok) {
			console.error("Failed to delete product:", res.statusText);
			return false;
		}

		revalidatePath("/market/myproducts");

		return true;
	} catch (error) {
		console.error("Error in removeProductAction:", error);
		return false;
	}
}

export async function getAll() {
	const cookieStorage = await cookies();
	const token = cookieStorage.get("session")?.value;
	const { id } = await verifySession(token);

	const res = await fetch(`${apiUrl}/api/products`, {
		method: "GET",
		headers: {
			Cookie: `session=${token}`,
		},
	});

	if (!res.ok) {
		return [];
	}
	const data = await res.json()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return data.filter((p: any) => p.sellerId !== id);
}

export async function getAllFromSeller(id?: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;

	const { id: userId, jwt } = await verifySession(token);
	const searchId = id === undefined ? userId : id;

	const res = await fetch(`${process.env.API_URL}/products/user/${searchId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	});

	if (!res.ok) return [];
	return await res.json();
}

export async function getProductDetails(productId: string) {
	const cookieStore = await cookies();
	const session = cookieStore.get("session")?.value;

	if (!session) {
		console.error("Sessão não encontrada");
		return null;
	}

	const res = await fetch(`${apiUrl}/api/sellerProducts/${productId}`, {
		method: "GET",
		headers: { Cookie: `session=${session}` },
	});

	if (!res.ok) {
		console.error("Erro ao buscar produto:", res.statusText);
		return null;
	}

	return await res.json();
}

export async function updateProduct(
	id: string | number,
	values: ProductToApi | FormData
) {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	await verifySession(token);

	try {
		// Detectar se é FormData ou objeto JSON
		const isFormData = values instanceof FormData;

		const headers: HeadersInit = {
			Cookie: `session=${token}`,
		};

		// Só adicionar Content-Type para JSON (FormData define automaticamente)
		if (!isFormData) {
			headers["Content-Type"] = "application/json";
		}

		const res = await fetch(`${apiUrl}/api/sellerProducts/${id}`, {
			method: "PUT",
			headers,
			body: isFormData ? values : JSON.stringify(values),
		});

		if (!res.ok) {
			console.error("Erro ao atualizar produto:", res);
			return { success: false, message: "Erro ao editar produto." };
		}

		return { success: true };
	} catch (err) {
		console.error("Erro no updateProduct:", err);
		return { success: false, message: "Erro interno ao atualizar o produto." };
	}
}
