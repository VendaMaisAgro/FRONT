
import Image from 'next/image';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className='bg-background'>
      <main className="flex flex-col items-center justify-center text-center h-screen">
        <Image
          src="/success-icon.svg"
          alt="Ícone de sucesso"
          width={200}
          height={200}
        />
        <h2 className="text-2xl font-bold text-black mt-6">Senha alterada com sucesso!</h2>
        <p className="text-sm font-medium mt-4 max-w-[400px]">
        Agora, você pode escolher e anunciar seu produto para venda ou navegar no nosso marcketplace.
        </p>

        <Link href="/" className="mt-6">
          <button className="bg-primary text-white font-semibold px-6 py-3 rounded hover:bg-sucess transition">
          Iniciar
          </button>
        </Link>
      </main>
    </div>
  );
}
