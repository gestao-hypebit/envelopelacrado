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
import RoletaDestinos from '@/components/pagina-casal/RoletaDestinos'
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

  // Seções alternadas: escuro=tudo dark, outros temas=dark+light alternados
  const SEC: Record<string, { base: string; dark: string; darkAlt: string; light: string; footer: string; acento: string }> = {
    classico: { base: '#0d0612', dark: '#100814', darkAlt: '#18081c', light: '#F5EDE3', footer: '#0d0612', acento: '#C9768F' },
    escuro:   { base: '#0D0D0D', dark: '#0D0D0D', darkAlt: '#111',    light: '#181818', footer: '#0D0D0D', acento: '#C9A96E' },
    pastel:   { base: '#0a0614', dark: '#0e0818', darkAlt: '#12082a', light: '#E8E0F0', footer: '#0a0614', acento: '#9b6fbd' },
    floral:   { base: '#060c06', dark: '#080e08', darkAlt: '#0c1408', light: '#F0F7EF', footer: '#060c06', acento: '#7a9e78' },
  }
  const sec = SEC[tema] ?? SEC.classico

  return (
    <AberturaPagina nome1={pagina.nome_pessoa1} nome2={pagina.nome_pessoa2} tema={tema}>
    <main style={{ background: sec.base, minHeight: '100vh', position: 'relative' }}>

      {/* Grain texture overlay — fixo, sutil, cobre toda a página */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.038,
        }}
      />

      {/* Contador — hero com carrossel de fotos */}
      <ContadorRelacionamento
        dataInicio={pagina.data_inicio}
        nome1={pagina.nome_pessoa1}
        nome2={pagina.nome_pessoa2}
        tema={tema}
        fotos={momentos?.filter((m) => m.foto_url).map((m) => m.foto_url!) ?? []}
      />

      {/* Narrativa da IA — dark alt */}
      {pagina.narrativa_ia && (
        <>
          <div style={{ height: 56, background: `linear-gradient(to bottom, ${sec.dark}, ${sec.darkAlt})` }} />
          <div style={{ background: sec.darkAlt }}>
            <NarrativaIA narrativa={pagina.narrativa_ia} tema={tema} />
          </div>
        </>
      )}

      {/* Galeria de fotos — light */}
      {momentos && momentos.length > 0 && (
        <>
          <div style={{ height: 72, background: `linear-gradient(to bottom, ${sec.darkAlt}, ${sec.light})` }} />
          <div style={{ background: sec.light }}>
            <GaleriaFotos momentos={momentos as Momento[]} tema={tema} />
          </div>
        </>
      )}

      {/* Linha do tempo — dark */}
      {momentos && momentos.length > 0 && (
        <>
          <div style={{ height: 72, background: `linear-gradient(to bottom, ${sec.light}, ${sec.dark})` }} />
          <div style={{ background: sec.dark }}>
            <TimeLine momentos={momentos as Momento[]} tema={tema} />
          </div>
        </>
      )}

      {/* Player de música — light */}
      {pagina.musica_url && (
        <>
          <div style={{ height: 64, background: `linear-gradient(to bottom, ${sec.dark}, ${sec.light})` }} />
          <div style={{ background: sec.light }}>
            <PlayerMusica musicaUrl={pagina.musica_url} tema={tema} />
          </div>
        </>
      )}

      {/* Roleta — dark */}
      <>
        <div style={{ height: 64, background: `linear-gradient(to bottom, ${pagina.musica_url ? sec.light : sec.dark}, ${sec.dark})` }} />
        <RoletaDestinos tema={tema} />
      </>

      {/* MessageBoard — light */}
      <>
        <div style={{ height: 64, background: `linear-gradient(to bottom, ${sec.dark}, ${sec.light})` }} />
        <div style={{ background: sec.light }}>
          <MessageBoard
            pageId={pagina.id}
            respostas={(respostas as Resposta[]) ?? []}
            tema={tema}
          />
        </div>
      </>

      {/* Assinatura — dark base */}
      <>
        <div style={{ height: 64, background: `linear-gradient(to bottom, ${sec.light}, ${sec.base})` }} />
        <div className="py-16 px-4 text-center" style={{ background: sec.base }}>
          <p
            className="italic"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
              color: sec.acento,
              opacity: 0.85,
            }}
          >
            Com todo meu amor, {pagina.nome_pessoa1} ♥
          </p>
        </div>
      </>

      {/* Footer */}
      <footer className="py-10 text-center px-4" style={{ background: sec.footer }}>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Crie a sua página em{' '}
          <Link href="/" style={{ color: sec.acento }} className="hover:underline font-medium">
            envelopelacrado.com.br
          </Link>
        </p>
      </footer>
    </main>
    </AberturaPagina>
  )
}

