import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MessageBoard from '@/components/pagina-casal/MessageBoard'
import type { Resposta } from '@/types'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ResponderPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pagina } = await supabase
    .from('pages')
    .select('id, nome_pessoa1, nome_pessoa2, tema')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!pagina) notFound()

  const { data: respostas } = await supabase
    .from('respostas')
    .select('*')
    .eq('page_id', pagina.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Link href={`/p/${slug}`} className="text-[#C9768F] text-sm hover:underline">
            ← Voltar para a página
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Deixe sua resposta
          </h1>
          <p className="text-gray-500 mt-2">
            Para {pagina.nome_pessoa1} & {pagina.nome_pessoa2}
          </p>
        </div>

        <MessageBoard
          pageId={pagina.id}
          respostas={(respostas as Resposta[]) ?? []}
          tema={pagina.tema}
        />
      </div>
    </div>
  )
}
