import { getUserData } from "@/actions/user";
import { redirect } from "next/navigation";
import PerfilContent from "./PerfilContent";

//! fix temporário para erro dynamic server usage
export const dynamic = 'force-dynamic';

export default async function PerfilPage() {
	try {
		const user = await getUserData();
		return <PerfilContent user={user} />;
	} catch (error) {
		console.error("Erro ao carregar perfil:", error);
		redirect("/login");
	}
}
