'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, RefreshCw, ArrowRight, Check, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DadosCriacao, DadosFotos } from '@/types'

export default function PreviewPage() {
  const router = useRouter()
  const [narrativa, setNarrativa] = useState('')
  const [gerando, setGerando] = useState(false)
  const [gerado, setGerado] = useState(false)
  const [erroGerado, setErroGerado] = useState(false)
  const [dadosStep2, setDadosStep2] = useState<DadosCriacao | null>(null)
  const [dadosStep3, setDadosStep3] = useState<DadosFotos | null>(null)
  const [slugPreview, setSlugPreview] = useState<string | null>(null)
  const [previewToken, setPreviewToken] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)
  const geracoesSessao = useRef(0)

  useEffect(() => {
    const init = async () => {
      const s2 = sessionStorage.getItem('memoriai_step2')
      const s3 = sessionStorage.getItem('memoriai_step3')

      if (!s2) { router.push('/criar/historia'); return }

      const dados2: DadosCriacao = JSON.parse(s2)
      const dados3: DadosFotos = s3 ? JSON.parse(s3) : { momentos: [] }

      setDadosStep2(dados2)
      setDadosStep3(dados3)

      const slugSalvo = sessionStorage.getItem('memoriai_slug')
      if (slugSalvo) setSlugPreview(slugSalvo)

      const tokenSalvo = sessionStorage.getItem('memoriai_preview_token')
      if (tokenSalvo) setPreviewToken(tokenSalvo)

      const narrativaSalva = sessionStorage.getItem('memoriai_narrativa')
      if (narrativaSalva) {
        setNarrativa(narrativaSalva)
        setGerado(true)
        geracoesSessao.current = 1
      } else {
        // Salva draft antes de gerar
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
              setSlugPreview(data.slug)
              setPreviewToken(data.previewToken)
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

      // Narrativa já foi salva no banco pela rota — força reload do iframe
      const slug = sessionStorage.getItem('memoriai_slug')
      if (slug) {
        setSlugPreview(slug)
        setIframeKey(k => k + 1)
      }
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
    await gerarNarrativa({ ...dadosStep2, tom: novoTom as DadosCriacao['tom'] })
  }

  const handleContinuar = () => {
    if (!gerado || !narrativa) return
    router.push('/criar/pagamento')
  }

  if (!dadosStep2) return null

  const iframeUrl = slugPreview && previewToken
    ? `/p/${slugPreview}?preview=1&pt=${previewToken}`
    : null

  return (
    <div className="space-y-6">

      {/* Estado: gerando narrativa */}
      <AnimatePresence mode="wait">
        {gerando && !gerado && (
          <motion.div
            key="gerando"
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
            {narrativa && (
              <p className="mt-4 text-sm text-gray-500 italic line-clamp-3">
                {narrativa}
              </p>
            )}
          </motion.div>
        )}

        {/* Estado: narrativa pronta — iframe da página real */}
        {(gerado || (gerando && gerado)) && iframeUrl && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C9768F]">
                  Preview — página real
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Exatamente como {dadosStep2.nome2} vai ver
                </p>
              </div>
              <a
                href={iframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-[#C9768F] hover:underline"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Tela cheia
              </a>
            </div>

            {/* Frame de celular com iframe real */}
            <div className="relative mx-auto" style={{ maxWidth: 360 }}>
              {/* Borda do celular */}
              <div style={{
                position: 'absolute',
                inset: -10,
                borderRadius: 44,
                background: '#111',
                boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.07)',
                zIndex: 0,
              }} />
              {/* Câmera */}
              <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 80, height: 6, background: '#000', borderRadius: 3, zIndex: 2 }} />

              {/* Tela com iframe */}
              <div style={{ position: 'relative', zIndex: 1, borderRadius: 34, overflow: 'hidden', background: '#0d0612' }}>
                {gerando && (
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    background: 'rgba(13,6,18,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 8,
                  }}>
                    <Loader2 className="w-6 h-6 text-[#C9768F] animate-spin" />
                    <p style={{ color: 'rgba(240,228,212,0.6)', fontSize: 12, fontFamily: 'Arial' }}>
                      Atualizando...
                    </p>
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={iframeUrl}
                  style={{
                    width: '100%',
                    height: 620,
                    border: 'none',
                    display: 'block',
                  }}
                  title="Preview da página"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Estado: erro */}
        {erroGerado && (
          <motion.div key="erro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <p className="text-red-500 mb-3 text-sm">Erro ao gerar narrativa. Tente novamente.</p>
            <Button variant="outline" onClick={() => dadosStep2 && gerarNarrativa(dadosStep2)}>
              Tentar novamente
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

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
          <Check className="w-4 h-4" /> Ficou ótimo! Pagar R$ 19,90 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
