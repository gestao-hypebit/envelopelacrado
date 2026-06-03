'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DadosCriacao, DadosFotos } from '@/types'

export default function PreviewPage() {
  const router = useRouter()
  const [narrativa, setNarrativa] = useState('')
  const [gerando, setGerando] = useState(false)
  const [gerado, setGerado] = useState(false)
  const [erroGerado, setErroGerado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [dadosStep2, setDadosStep2] = useState<DadosCriacao | null>(null)
  const [dadosStep3, setDadosStep3] = useState<DadosFotos | null>(null)
  const geracoesSessao = useRef(0)

  useEffect(() => {
    const init = async () => {
    const s2 = sessionStorage.getItem('memoriai_step2')
    const s3 = sessionStorage.getItem('memoriai_step3')

    if (!s2) {
      router.push('/criar/historia')
      return
    }

    const dados2: DadosCriacao = JSON.parse(s2)
    const dados3: DadosFotos = s3 ? JSON.parse(s3) : { momentos: [] }

    setDadosStep2(dados2)
    setDadosStep3(dados3)

    // Verifica se já gerou narrativa nesta sessão
    const narrativaSalva = sessionStorage.getItem('memoriai_narrativa')
    if (narrativaSalva) {
      setNarrativa(narrativaSalva)
      setGerado(true)
      geracoesSessao.current = 1
    } else {
      // Salva a página como draft ANTES de gerar para ter o pageId
      // (necessário para o rate limiting server-side)
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
          }
        } catch { /* segue mesmo sem salvar */ }
      }
      gerarNarrativa(dados2)
    }
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gerarNarrativa = async (dados: DadosCriacao) => {
    // Rate limit: máximo 1 geração antes do pagamento por sessão
    // Após esse limite, só libera regenerar se já pagou
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

      if (response.status === 429) {
        setErroGerado(true)
        setGerando(false)
        return
      }
      if (!response.ok) throw new Error('Erro na geração')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let texto = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          texto += chunk
          setNarrativa(texto)
        }
      }

      geracoesSessao.current += 1
      setGerado(true)
      sessionStorage.setItem('memoriai_narrativa', texto)

      // Atualiza a narrativa no banco
      const slug = sessionStorage.getItem('memoriai_slug')
      const email = dadosStep2?.email
      if (slug && email) {
        fetch('/api/paginas/atualizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, email, campos: { narrativa_ia: texto } }),
        }).catch(() => {})
      }
    } catch {
      setErroGerado(true)
    } finally {
      setGerando(false)
    }
  }

  const handleRegenerarComTom = async (novoTom: string) => {
    if (!dadosStep2) return
    // Só permite regenerar se não excedeu o limite pré-pagamento
    if (geracoesSessao.current >= 3) {
      alert('Limite de regenerações atingido. Complete o pagamento para regenerar sem limites.')
      return
    }
    await gerarNarrativa({ ...dadosStep2, tom: novoTom as DadosCriacao['tom'] })
  }

  const handleVerResultado = async () => {
    if (!dadosStep2 || !narrativa) return
    setSalvando(true)
    try {
      const res = await fetch('/api/dev/ativar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dadosCriacao: dadosStep2,
          dadosFotos: dadosStep3,
          narrativa,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      router.push(`/p/${json.slug}`)
    } catch {
      alert('Erro ao salvar. Verifique o console.')
    } finally {
      setSalvando(false)
    }
  }

  const handleContinuar = async () => {
    if (!dadosStep2 || !narrativa) return
    setSalvando(true)

    try {
      const res = await fetch('/api/paginas/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dadosCriacao: dadosStep2,
          dadosFotos: dadosStep3,
          narrativa,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar')

      sessionStorage.setItem('memoriai_page_id', data.id)
      sessionStorage.setItem('memoriai_slug', data.slug)

      router.push('/criar/pagamento')
    } catch {
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (!dadosStep2) return null

  const nomes = dadosStep2 ? `${dadosStep2.nome1} & ${dadosStep2.nome2}` : ''

  return (
    <div className="space-y-6">
      {/* Preview da página */}
      <div className="rounded-3xl overflow-hidden border border-[#F5EDE3] shadow-lg">
        {/* Header do casal */}
        <div
          className="p-8 text-center"
          style={{
            background: dadosStep2.tema === 'escuro'
              ? 'linear-gradient(135deg, #0D0D0D, #1a1a1a)'
              : 'linear-gradient(180deg, #FAFAF8, #F5EDE3)',
          }}
        >
          <p className="text-[#C9768F] text-sm font-medium mb-1">Unidos desde</p>
          <p className="text-gray-500 text-sm mb-4">
            {dadosStep2.dataInicio ? new Date(dadosStep2.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
          </p>
          <h2
            className="font-display text-4xl font-bold mb-2"
            style={{ color: dadosStep2.tema === 'escuro' ? '#C9A96E' : '#1a1a1a' }}
          >
            {nomes}
          </h2>
          <div className="w-12 h-px bg-[#C9768F] mx-auto" />
        </div>

        {/* Narrativa */}
        <div className="p-8 bg-white">
          <h3 className="font-display text-lg font-bold text-gray-900 mb-4 text-center">
            Nossa história
          </h3>

          {gerando ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#C9768F] text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A IA está escrevendo a história de vocês...</span>
              </div>
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap font-display text-base typewriter-cursor"
                style={{ minHeight: '100px' }}
              >
                {narrativa}
              </div>
            </div>
          ) : erroGerado ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Erro ao gerar narrativa. Tente novamente.</p>
              <Button
                variant="outline"
                onClick={() => dadosStep2 && gerarNarrativa(dadosStep2)}
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-display text-base">
              {narrativa}
            </div>
          )}
        </div>

        {/* Momentos preview */}
        {dadosStep3 && dadosStep3.momentos.length > 0 && (
          <div className="p-8 bg-[#FAFAF8] border-t border-[#F5EDE3]">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-4 text-center">
              Linha do tempo
            </h3>
            <div className="space-y-3">
              {dadosStep3.momentos.slice(0, 3).map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9768F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{m.titulo}</p>
                    {m.data && (
                      <p className="text-xs text-gray-400">
                        {new Date(m.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {dadosStep3.momentos.length > 3 && (
                <p className="text-xs text-gray-400 text-center">
                  + {dadosStep3.momentos.length - 3} momentos adicionais
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Opções de regeneração */}
      {gerado && !gerando && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-6 border border-[#F5EDE3]"
        >
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Regenerar com outro tom:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { tom: 'romantico', label: 'Mais romântico' },
              { tom: 'poetico', label: 'Mais poético' },
              { tom: 'divertido', label: 'Mais divertido' },
              { tom: 'simples', label: 'Mais simples' },
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
            Após o pagamento, você pode regenerar quantas vezes quiser.
          </p>
        </motion.div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/criar/fotos')}
          disabled={salvando || gerando}
        >
          ← Voltar
        </Button>
        <Button
          size="lg"
          onClick={handleContinuar}
          disabled={!gerado || gerando || salvando}
          className="flex-1 group"
        >
          {salvando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Ficou ótimo! Pagar R$ 19,90
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>

      {/* Botão de preview completo — só em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && gerado && !gerando && (
        <button
          onClick={handleVerResultado}
          disabled={salvando}
          className="w-full mt-1 py-2 text-xs text-gray-400 hover:text-[#C9768F] transition-colors disabled:opacity-50"
        >
          {salvando ? 'Salvando...' : '🛠 Ver resultado completo sem pagar (só dev)'}
        </button>
      )}
    </div>
  )
}
