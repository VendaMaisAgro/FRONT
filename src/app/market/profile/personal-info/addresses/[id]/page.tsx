import TanstackProvider from "@/providers/tanstackProvider";
import Link from "next/link";
import EditAddressForm from "../components/editAddressForm";
import { getAddressById } from "@/actions/address";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const address = await getAddressById(id);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <nav aria-label="breadcrumb" className="w-full max-w-4xl mx-auto mb-6">
          <ol className="flex flex-wrap items-center text-sm text-muted-foreground space-x-1">
            <li>
              <Link href="/market/profile" className="text-foreground hover:underline">
                Meu perfil
              </Link>
            </li>
            <li><span className="px-1">/</span></li>
            <li>
              <Link href="/market/profile/personal-info" className="text-foreground hover:underline">
                Informações pessoais
              </Link>
            </li>
            <li><span className="px-1">/</span></li>
            <li>
              <Link href="/market/profile/personal-info/addresses" className="text-foreground hover:underline">
                Meus endereços
              </Link>
            </li>
            <li><span className="px-1">/</span></li>
            <li className="text-foreground font-semibold">Editar endereço</li>
          </ol>
        </nav>
        <TanstackProvider>
          <EditAddressForm data={address} />
        </TanstackProvider>
      </div>
    </main>
  );
}
