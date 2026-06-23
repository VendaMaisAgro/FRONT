import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = (await cookies()).get("session")?.value;
  const token = await verifySession(session);

  try {
    const body = await request.json();
    const { status, cargoWeightKg, plannedHarvestDate, plannedPickupDate, plannedDeliveryDate } = body;

    const requestBody: {
      status?: string;
      cargoWeightKg?: number | string;
      plannedHarvestDate?: string;
      plannedPickupDate?: string;
      plannedDeliveryDate?: string;
    } = {};

    if (status) {
      requestBody.status = status;
    }

    if (cargoWeightKg) {
      const weightAsNumber = Number(cargoWeightKg);
      if (!isNaN(weightAsNumber)) {
        requestBody.cargoWeightKg = weightAsNumber;
      } else {
        requestBody.cargoWeightKg = cargoWeightKg;
      }
    }

    if (plannedHarvestDate) requestBody.plannedHarvestDate = plannedHarvestDate;
    if (plannedPickupDate) requestBody.plannedPickupDate = plannedPickupDate;
    if (plannedDeliveryDate) requestBody.plannedDeliveryDate = plannedDeliveryDate;

    const res = await fetch(`${process.env.API_URL}/sales/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    try {
      const errData = await res.json();
      return NextResponse.json(errData, { status: res.status });
    } catch {
      return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: res.status });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
