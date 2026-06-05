'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, RefreshCw, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DadosCriacao, DadosFotos, Momento } from '@/types'
import ContadorRelacionamento from '@/components/pagina-casal/ContadorRelacionamento'
import NarrativaIA from '@/components/pagina-casal/NarrativaIA'
import GaleriaFotos from '@/components/pagina-casal/GaleriaFotos'
import TimeLine from '@/components/pagina-casal/TimeLine'

const SEC: Record<string, { base: string; dark: string; darkAlt: string; light: string; acento: string }> = {
  classico: { base: '#0d0612', dark: '#100814', darkAlt: '#18081c', light: '#F5EDE3', acento: '#C9768F' },
  escuro:   { base: '#0D0D0D', dark: '#0D0D0D', darkAlt: '#111',    light: '#181818', acento: '#C9A96E' },
  pastel:   { base: '#0a0614', dark: '#0e0818', darkAlt: '#12082a', light: '#E8E0F0', acento: '#9b6fbd' },
  floral:   { base: '#060c06', dark: '#080e08', darkAlt: '#0c1408', light: '#F0F7EF', acento: '#7a9e78' },
}

export default function PreviewPage() {
  const router = useRouter()
  const [narrativa, setNarrativa] = useState('')
  const [gerando, setGerando] = useState(false)
  const [gerado, setGerado] = useState(false)
  const [erroGerado, setErroGerado] = useState(false)
  const [dadosStep2, setDadosStep2] = useState<DadosCriacao | null>(null)
  const [dadosStep3, setDadosStep3] = useState<DadosFotos | null>(null)
  const geracoesSessao = useRef(0)

  const momentosFake = useMemo<Momento[]>(() => {
    if (!dadosStep3) return []
    return dadosStep3.momentos
      .filter((m) => m.titulo?.trim())
      .map((m, i) => ({
        id: `preview-${i}`,
        page_id: 'preview',
        titulo: m.titulo,
        descricao: m.descricao || null,
        data: m.data || null,
        foto_url: m.foto_url || null,
        ordem: i,
        created_at: new Date().toISOString(),
      }))
  }, [dadosStep3])

  useEffect(() => {
    const init = async () => {
      const s2 = sessionStorage.getItem('memoriai_step2')
      const s3 = sessionStorage.getItem('memoriai_step3')

      if (!s2) { router.push('/criar/historia'); return }

      const dados2: DadosCriacao = JSON.parse(s2)
      const dados3: DadosFotos = s3 ? JSON.parse(s3) : { momentos: [] }

      setDadosStep2(dados2)
      setDadosStep3(dados3)

      const narrativaSalva = sessionStorage.getItem('memoriai_narrativa')
      if (narrativaSalva) {
        setNarrativa(narrativaSalva)
        setGerado(true)
        geracoesSessao.current = 1
      } else {
        const pageIdExistente = sessionStorage.getItem('memoriai_page_id')
        if (!pageIdExistente) {
          try {
            const res = await fetch('/api/paginas/criar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dadosCriacao: dados2, dadosFotos: dados3, narrativa: '' }),
            })
            const data = await res.json()
            if (res.ok) {
              sessionStorage.setItem('memoriai_page_id', data.id)
              sessionStorage.setItem('memoriai_slug', data.slug)
              sessionStorage.setItem('memoriai_preview_token', data.previewToken)
            }
          } catch { /* segue */ }
        }
        gerarNarrativa(dados2)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gerarNarrativa = async (dados: DadosCriacao) => {
    if (geracoesSessao.current >= 1 && !gerado) return

    setGerando(true)
    setNarrativa('')
    setErroGerado(false)

    try {
      const pageId = sessionStorage.getItem('memoriai_page_id')
      const response = await fetch('/api/gerar-narrativa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          nome1: dados.nome1,
          nome2: dados.nome2,
          dataInicio: dados.dataInicio,
          comoSeConheceram: dados.comoSeConheceram,
          momentos: dados.momentos.map((m) => m.titulo),
          apelidos: dados.apelidos,
          tom: dados.tom,
        }),
      })

      if (response.status === 429) { setErroGerado(true); setGerando(false); return }
      if (!response.ok) throw new Error()

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let texto = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          texto += decoder.decode(value)
          setNarrativa(texto)
        }
      }

      geracoesSessao.current += 1
      setGerado(true)
      sessionStorage.setItem('memoriai_narrativa', texto)
    } catch {
      setErroGerado(true)
    } finally {
      setGerando(false)
    }
  }

  const handleRegenerarComTom = async (novoTom: string) => {
    if (!dadosStep2) return
    if (geracoesSessao.current >= 3) {
      alert('Limite de regenerações atingido. Complete o pagamento para regenerar sem limites.')
      return
    }
    sessionStorage.removeItem('memoriai_narrativa')
    await gerarNarrativa({ ...dadosStep2, tom: novoTom as DadosCriacao['tom'] })
  }

  const handleContinuar = () => {
    if (!gerado || !narrativa) return
    router.push('/criar/pagamento')
  }

  if (!dadosStep2) return null

  const tema = dadosStep2.tema || 'classico'
  const sec = SEC[tema] ?? SEC.classico
  const fotos = momentosFake.filter((m) => m.foto_url).map((m) => m.foto_url!)
  const temConteudo = narrativa.length > 0 || gerado

  return (
    <div className="space-y-6">

      {/* Loading inicial — antes de qualquer texto aparecer */}
      <AnimatePresence>
        {gerando && !narrativa && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-[#F5EDE3] bg-white p-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#F5EDE3] flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-[#C9768F] animate-spin" />
            </div>
            <p className="font-display text-lg font-bold text-gray-900 mb-1">
              Escrevendo a história de vocês...
            </p>
            <p className="text-sm text-gray-400">
              A IA está criando uma narrativa única para {dadosStep2.nome1} e {dadosStep2.nome2}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview completo — aparece assim que o texto começa a chegar */}
      {temConteudo && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cabeçalho do preview */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C9768F]">
                Preview — página real
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Exatamente como {dadosStep2.nome2} vai ver
              </p>
            </div>
            {gerando && (
              <div className="flex items-center gap-1.5 text-xs text-[#C9768F]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Escrevendo...
              </div>
            )}
          </div>

          {/* Corpo da página — mesmos componentes e estilos do /p/[slug] */}
          <div style={{ background: sec.base, borderRadius: 16, overflow: 'hidden' }}>

            {/* Hero: contador + fotos */}
            <ContadorRelacionamento
              dataInicio={dadosStep2.dataInicio}
              nome1={dadosStep2.nome1}
              nome2={dadosStep2.nome2}
              tema={tema}
              fotos={fotos}
            />

            {/* Narrativa IA — aparece em tempo real durante o streaming */}
            {narrativa && (
              <>
                <div style={{ height: 32, background: `linear-gradient(to bottom, ${sec.dark}, ${sec.darkAlt})` }} />
                <div style={{ background: sec.darkAlt }}>
                  <NarrativaIA narrativa={narrativa} tema={tema} />
                </div>
              </>
            )}

            {/* Galeria de fotos */}
            {momentosFake.length > 0 && (
              <>
                <div style={{ height: 44, background: `linear-gradient(to bottom, ${narrativa ? sec.darkAlt : sec.dark}, ${sec.light})` }} />
                <div style={{ background: sec.light }}>
                  <GaleriaFotos momentos={momentosFake} tema={tema} />
                </div>
              </>
            )}

            {/* Jornada em polaroids */}
            {momentosFake.length > 0 && (
              <>
                <div style={{ height: 44, background: `linear-gradient(to bottom, ${momentosFake.some(m => m.foto_url) ? sec.light : sec.dark}, ${sec.dark})` }} />
                <div style={{ background: sec.dark }}>
                  <TimeLine momentos={momentosFake} tema={tema} />
                </div>
              </>
            )}

            {/* Assinatura final */}
            <div style={{ height: 40, background: `linear-gradient(to bottom, ${sec.dark}, ${sec.base})` }} />
            <div className="py-12 px-4 text-center" style={{ background: sec.base }}>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                  color: sec.acento,
                  fontStyle: 'italic',
                  opacity: 0.85,
                }}
              >
                Com todo meu amor, {dadosStep2.nome1} ♥
              </p>
            </div>

          </div>
        </motion.div>
      )}

      {/* Erro */}
      {erroGerado && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <p className="text-red-500 mb-3 text-sm">Erro ao gerar narrativa. Tente novamente.</p>
          <Button variant="outline" onClick={() => dadosStep2 && gerarNarrativa(dadosStep2)}>
            Tentar novamente
          </Button>
        </motion.div>
      )}

      {/* Regenerar com outro tom */}
      {gerado && !gerando && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-5 border border-[#F5EDE3]"
        >
          <p className="text-sm font-semibold text-gray-700 mb-3">Regenerar com outro tom:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { tom: 'romantico', label: 'Mais romântico' },
              { tom: 'poetico',   label: 'Mais poético' },
              { tom: 'divertido', label: 'Mais divertido' },
              { tom: 'simples',   label: 'Mais simples' },
            ].map(({ tom, label }) => (
              <button
                key={tom}
                onClick={() => handleRegenerarComTom(tom)}
                disabled={gerando}
                className="px-4 py-2 text-xs font-medium rounded-full border border-[#C9768F] text-[#C9768F] hover:bg-[#C9768F] hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Após o pagamento, regenere quantas vezes quiser.
          </p>
        </motion.div>
      )}

      {/* Ações */}
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={() => router.push('/criar/fotos')} disabled={gerando}>
          ← Voltar
        </Button>
        <Button
          size="lg"
          onClick={handleContinuar}
          disabled={!gerado || gerando}
          className="flex-1 group"
        >
          <Check className="w-4 h-4" /> Ficou ótimo! Pagar R$ 19,90{' '}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

    </div>
  )
}
