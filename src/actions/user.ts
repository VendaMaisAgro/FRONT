'use server'

import { cookies } from 'next/headers'
import { verifySession } from '@/lib/session'

export interface FullUserData {
    id: number;
    name: string;
    address?: string;
    email: string;
    phone: string;
    cpf: string | null;
    cnpj: string | null;
    ccir: string | null;
    role: 'cooperative' | 'distributor-or-cooperative' | 'farmer' | string;
    tipo: 'Cooperativa' | 'Distribuidor/Associação' | 'Produtor Rural' | string;
    valid: boolean;
    img?: string;
}

export async function getUserData(): Promise<FullUserData> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  const session = await verifySession(token)
  if (!session) {
    throw new Error('Sessão inválida')
  }

  const { jwt, id } = session

  const res = await fetch(`${process.env.API_URL}/user/${id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Erro ao buscar dados do usuário.')
  }

  const data = await res.json()

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone_number ?? data.phone ?? '',
    cpf: data.cpf,
    address: data.address,
    cnpj: data.cnpj,
    ccir: data.ccir,
    role: data.role,
    // Map API role to pt-BR label (only these roles now)
    tipo:
      data.role === 'cooperative'
        ? 'Cooperativa' :
        data.role === 'distributor-or-cooperative'
        ? 'Distribuidor/Associação'
        : 'Produtor Rural',
    valid: data.valid,
    img: data.img,
  }
}

export async function getProducerById(id: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    console.error("Cookie de sessão não encontrado");
    return null;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/producer/${id}`, {
    method: "GET",
    headers: { Cookie: `session=${session}` },
  });

  if (!res.ok) {
    console.error(
      `Erro ao ler vendedor ${id}: ${res.status} ${res.statusText}`
    );
    return null;
  }
  return await res.json();
}





/*import { cookies } from "next/headers";
>>>>>>> Stashed changes
import { redirect } from "next/navigation";

type Address = {
  id: number;
  city: string;
  district: string;
  street: string;
  number: string;
  state: string;
};

type UserData = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: Address | null;
};

type ProducerResponse = {
  id: number;
  itr?: string;
  ccir: string;
  userId: number;
  user: UserData;
};

type BuyerResponse = {
  id: number;
  cpf: string | null;
  cnpj: string | null;
  userId: number;
  user: UserData;
};

export type NormalizedUser = {
  name: string;
  email: string;
  phone: string;
  ccir: string;
  cnpj: string;
  cpf: string;
  role: "buyer" | "producer";
  addresses?: Address[];
};

export async function fetchUserDataNormalized(): Promise<NormalizedUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  let jwt: string;
  let userId: number;
  try {
    const sessionData = await verifySession(token);
    jwt = sessionData.jwt;
    userId = sessionData.userId;
  } catch {
    redirect("/login");
    return null as never;
  }

  // Tenta buscar como produtor
  try {
    const producerRes = await fetch(
      `${process.env.API_URL}/producer/${userId}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store",
      }
    );
    if (producerRes.ok) {
      const producerData = (await producerRes.json()) as ProducerResponse;
      return {
        name: producerData.user.name,
        email: producerData.user.email,
        phone: producerData.user.phone,
        ccir: producerData.ccir,
        cnpj: "",
        cpf: "",
        role: "producer",
        addresses: producerData.user.address ? [producerData.user.address] : [],
      };
    }

    // Se não for produtor (404), tenta como comprador
    if (producerRes.status === 404) {
      const buyerRes = await fetch(`${process.env.API_URL}/buyers/${userId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store",
      });
      if (!buyerRes.ok) {
        throw new Error("Erro ao buscar dados do comprador");
      }
      const buyerData = (await buyerRes.json()) as BuyerResponse;
      return {
        name: buyerData.user.name,
        email: buyerData.user.email,
        phone: buyerData.user.phone,
        ccir: "",
        cnpj: buyerData.cnpj ?? "",
        cpf: buyerData.cpf ?? "",
        role: "buyer",
        addresses: buyerData.user.address ? [buyerData.user.address] : [],
      };
    }

    throw new Error("Erro ao buscar dados do produtor");
  } catch (err) {
    console.error("Erro fetching profile:", err);
    redirect("/login");
    return null as never;
  }
}

export async function getProducerById(id: number) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    console.error("Cookie de sessão não encontrado");
    return null;
  }

  const res = await fetch(`${process.env.URL}/api/producer/${id}`, {
    method: "GET",
    headers: { Cookie: `session=${session}` },
  });

  if (!res.ok) {
    console.error(
      `Erro ao ler vendedor ${id}: ${res.status} ${res.statusText}`
    );
    return null;
  }
  return await res.json();
}
*/
