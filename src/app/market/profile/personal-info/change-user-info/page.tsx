import { getUserData } from "@/actions/user";
import Link from "next/link";
import EditProfileForm from "./components/EditProfileForm";

//! fix temporário para erro dynamic server usage
export const dynamic = 'force-dynamic';

export default async function EditProfilePage() {
  let initialData;

  try {
    const user = await getUserData();

    initialData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      ccir: user.ccir ?? '',
      cnpj: user.cnpj ?? '',
      cpf: user.cpf ?? '',
      role: user.role,
    };
  } catch (err) {
	console.error(err);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-lg font-medium mb-2">
            Erro ao carregar perfil
          </h1>
          <p className="text-sm text-red-600">
            Erro ao carregar o perfil, por favor tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 md:px-20 py-10 flex flex-col items-center">
      <nav aria-label="breadcrumb" className="w-full max-w-4xl mb-4">
        <ol className="flex flex-wrap items-center text-sm text-muted-foreground space-x-1">
          <li>
            <Link
              href="/market/profile"
              className="text-foreground hover:underline"
            >
              Meu perfil
            </Link>
          </li>
          <li>
            <span className="px-1">/</span>
          </li>
          <li>
            <Link
              href="/market/profile/personal-info"
              className="text-foreground hover:underline"
            >
              Informações pessoais
            </Link>
          </li>
          <li>
            <span className="px-1">/</span>
          </li>
          <li className="text-foreground font-semibold">
            Editar informações de identificação
          </li>
        </ol>
      </nav>

      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6 md:p-10 space-y-6 text-foreground">
        <div>
          <h3 className="text-lg font-medium mb-4">
            Editar Informações de Identificação
          </h3>
          <EditProfileForm initialData={initialData} />
        </div>
      </section>
    </main>
  );
}
