import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AberturaPagina from '@/components/pagina-casal/AberturaPagina'
import ContadorRelacionamento from '@/components/pagina-casal/ContadorRelacionamento'
import NarrativaIA from '@/components/pagina-casal/NarrativaIA'
import TimeLine from '@/components/pagina-casal/TimeLine'
import GaleriaFotos from '@/components/pagina-casal/GaleriaFotos'
import PlayerMusica from '@/components/pagina-casal/PlayerMusica'
import MessageBoard from '@/components/pagina-casal/MessageBoard'
import type { Momento, Resposta } from '@/types'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('nome_pessoa1, nome_pessoa2')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!data) return { title: 'Página não encontrada' }

  return {
    title: `${data.nome_pessoa1} & ${data.nome_pessoa2} | Envelope Lacrado`,
    description: `A história de amor de ${data.nome_pessoa1} e ${data.nome_pessoa2}, narrada pela IA.`,
  }
}

export default async function PaginaCasal({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: pagina } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!pagina) notFound()

  const { data: momentos } = await supabase
    .from('momentos')
    .select('*')
    .eq('page_id', pagina.id)
    .order('ordem', { ascending: true })

  const { data: respostas } = await supabase
    .from('respostas')
    .select('*')
    .eq('page_id', pagina.id)
    .order('created_at', { ascending: false })

  const tema = pagina.tema ?? 'classico'
  const escuro = tema === 'escuro'

  const bgStyles: Record<string, string> = {
    classico: 'linear-gradient(180deg, #FAFAF8 0%, #F5EDE3 40%, #FAFAF8 100%)',
    escuro: 'linear-gradient(180deg, #0D0D0D 0%, #1a1a1a 50%, #0D0D0D 100%)',
    pastel: 'linear-gradient(180deg, #F8F4FF 0%, #E8E0F0 40%, #F8F4FF 100%)',
    floral: 'linear-gradient(180deg, #FFFFFF 0%, #F0F7EF 40%, #FFFFFF 100%)',
  }

  return (
    <AberturaPagina nome1={pagina.nome_pessoa1} nome2={pagina.nome_pessoa2} tema={tema}>
    <main
      style={{
        background: bgStyles[tema] || bgStyles.classico,
        minHeight: '100vh',
      }}
    >
      {/* Contador de relacionamento */}
      <ContadorRelacionamento
        dataInicio={pagina.data_inicio}
        nome1={pagina.nome_pessoa1}
        nome2={pagina.nome_pessoa2}
        tema={tema}
      />

      {/* Divisor */}
      <div className="max-w-xl mx-auto px-4">
        <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, #C9768F, transparent)' }} />
      </div>

      {/* Narrativa da IA */}
      {pagina.narrativa_ia && (
        <NarrativaIA narrativa={pagina.narrativa_ia} tema={tema} />
      )}

      {/* Galeria de fotos */}
      {momentos && momentos.length > 0 && (
        <GaleriaFotos momentos={momentos as Momento[]} tema={tema} />
      )}

      {/* Linha do tempo */}
      {momentos && momentos.length > 0 && (
        <TimeLine momentos={momentos as Momento[]} tema={tema} />
      )}

      {/* Player de música */}
      {pagina.musica_url && (
        <PlayerMusica musicaUrl={pagina.musica_url} tema={tema} />
      )}

      {/* MessageBoard */}
      <MessageBoard
        pageId={pagina.id}
        respostas={(respostas as Resposta[]) ?? []}
        tema={tema}
      />

      {/* Divisor final */}
      <div className="max-w-xl mx-auto px-4 mb-8">
        <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, #C9768F, transparent)' }} />
      </div>

      {/* Footer de marketing */}
      <footer className="py-8 text-center px-4">
        <p className="text-sm" style={{ color: escuro ? '#666' : '#999' }}>
          Crie a sua página em{' '}
          <Link href="/" className="text-[#C9768F] hover:underline font-medium">
            envelopelacrado.com.br
          </Link>
        </p>
      </footer>
    </main>
    </AberturaPagina>
  )
}

