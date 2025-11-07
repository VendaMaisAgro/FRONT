import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = (await cookies()).get("session")?.value;
	const token = await verifySession(session);
	const { id } = await params;

	if (!token) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const res = await fetch(`${process.env.API_URL}/user/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token.jwt}`,
			},
		});
		const data = await res.json();

		return NextResponse.json(data, { status: res.status });
	} catch (err) {
		return NextResponse.json({ message: err }, { status: 500 });
	}
}

// export async function PUT() {}

// export async function DELETE() {}
