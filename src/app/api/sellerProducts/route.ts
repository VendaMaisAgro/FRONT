import { verifySession } from "@/lib/session";
import { Product } from "@/types/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);
  const searchFor = req?.nextUrl?.searchParams.get("name");
  const apiUrl = searchFor
    ? `${process.env.API_URL}/products?name=${searchFor}`
    : `${process.env.API_URL}/products`;

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token.jwt}`,
    },
  });
  const data: Product[] = await res.json();

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const { jwt } = await verifySession(token);

  try {
    const productData = await request.formData();

    const res = await fetch(`${process.env.API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: productData,
    });

    return NextResponse.json({ status: res.status });
  } catch (err) {
    console.log(err);
  }
}

//     // Adicionar o novo produto ao array
//     myproducts.push(newProduct);

//     // Retornar resposta de sucesso com o produto criado
//     return NextResponse.json(
//       {
//         message: "Produto cadastrado com sucesso",
//         product: newProduct,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Erro ao cadastrar produto:", error);
//     return NextResponse.json(
//       {
//         message: "Erro interno do servidor",
//       },
//       { status: 500 }
//     );
//   }
// }
