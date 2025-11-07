// app/market/perfil/page.tsx
import { getUserData } from '@/actions/user'
import {
  ChevronRight,
  IdCard,
  MapPin
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

//! fix temporário para erro dynamic server usage
export const dynamic = 'force-dynamic';

export default async function ProfileManagementPage() {
  let name = ''
  let email = ''
  let img: string | undefined

  try {
    const data = await getUserData()
    name = data.name
    email = data.email
    img = data.img
  } catch (err) {
    console.error('Erro ao carregar usuário:', err)
    // Aqui poderia ser redirecionado para login ou mostrar fallback
  }

  const items = [
    {
      title: 'Informações pessoais',
      subtitle: 'Informação do seu documento de identidade.',
      icon: IdCard,
      href: '/market/profile/personal-info',
    },
    {
      title: 'Endereços',
      subtitle: 'Gerencie os endereços da sua conta.',
      icon: MapPin,
      href: '/market/profile/personal-info/addresses',
    },
  ]

  return (
    <main className="min-h-screen bg-background px-4 md:px-20 py-10 flex flex-col items-center space-y-6">
      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-4 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
          {img ? (
            <Image
              src={img}
              alt={`Foto de ${name}`}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <span className="font-semibold text-xl text-foreground/70">
              {name?.trim?.().charAt(0)?.toUpperCase?.() || '?'}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-base font-medium text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </section>

      <section className="w-full max-w-4xl bg-white rounded-lg border border-border shadow p-6 md:p-10">
        <nav className="space-y-4">
          {items.map(({ title, subtitle, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-border">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </nav>
      </section>
    </main>
  )
}
