import type { Metadata } from "next";
import SellerProfileClient from "@/components/seller-profile/SellerProfileClient";
import { getProducerById } from "@/actions/user";

export const dynamic = "force-dynamic";

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;

    try {
        const user = await getProducerById(id);
        const name =
            (typeof user?.name === "string" && user.name) ||
            (typeof user?.fullName === "string" && user.fullName) ||
            (typeof user?.username === "string" && user.username) ||
            `Vendedor #${id}`;

        const title = `Perfil de ${name}`;
        return {
            title,
            openGraph: { title },
            twitter: { title },
        };
    } catch {
        // Fallback caso a action/endpoint falhe
        const title = `Perfil do vendedor #${id}`;
        return { title, openGraph: { title }, twitter: { title } };
    }
}

export default async function SellerProfilePage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return <SellerProfileClient sellerId={id} />;
}
