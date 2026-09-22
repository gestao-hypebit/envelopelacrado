import Link from 'next/link'
import { Heart, ExternalLink, Edit, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/dashboard/LoginForm'
import LogoutButton from '@/components/dashboard/LogoutButton'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: paginas } = user
    ? await supabase
        .from('pages')
        .select('id, slug, nome_pessoa1, nome_pessoa2, data_inicio, tema, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
    : { data: null }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
      <header className="border-b" style={{ background: 'white', borderColor: '#F5EDE3' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold" style={{ color: '#C9768F' }}>
            💌 Envelope Lacrado
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/criar" className="text-sm font-medium" style={{ color: '#C9768F' }}>
              + Nova página
            </Link>
            {user && <LogoutButton />}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: '#1a0e14' }}>
            Minhas páginas
          </h1>
          <p className="text-base" style={{ color: '#A0785A' }}>
            {user
              ? `Logado como ${user.email}`
              : 'Acesse com o email que usou na compra pra ver e editar suas páginas.'}
          </p>
        </div>

        {!user && <LoginForm />}

        {user && (
          <>
            {!paginas || paginas.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border" style={{ background: 'white', borderColor: '#F5EDE3' }}>
                <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: '#F5C6D4' }} />
                <p className="font-semibold mb-1" style={{ color: '#1a0e14' }}>Nenhuma página encontrada</p>
                <p className="text-sm mb-4" style={{ color: '#A0785A' }}>
                  Verifique se comprou com este email ou crie sua primeira página.
                </p>
                <Link href="/criar"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
                  Criar minha primeira página <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm" style={{ color: '#A0785A' }}>
                  {paginas.length} {paginas.length === 1 ? 'página encontrada' : 'páginas encontradas'}
                </p>
                {paginas.map((p) => (
                  <div key={p.id}
                    className="bg-white rounded-2xl border p-6 flex items-center justify-between gap-4"
                    style={{ borderColor: '#F5EDE3' }}>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display font-bold text-lg truncate" style={{ color: '#1a0e14' }}>
                        {p.nome_pessoa1} & {p.nome_pessoa2}
                      </h2>
                      <p className="text-xs mt-0.5" style={{ color: '#A0785A' }}>
                        Desde {new Date(p.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        {' · '}
                        Criada em {new Date(p.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs mt-1 font-mono" style={{ color: '#C9768F' }}>
                        envelopelacrado.com.br/p/{p.slug}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/p/${p.slug}`} target="_blank"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors hover:bg-gray-50"
                        style={{ borderColor: '#F5EDE3', color: '#7a6070' }}>
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ver
                      </Link>
                      <Link href={`/editar/${p.slug}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
