'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Loader2, Check, ArrowLeft, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

const TEMAS = [
  { id: 'classico', label: 'Clássico', cor: '#C9768F' },
  { id: 'escuro',   label: 'Escuro',   cor: '#C9A96E' },
  { id: 'pastel',   label: 'Pastel',   cor: '#9B8EC4' },
  { id: 'floral',   label: 'Floral',   cor: '#7D9B76' },
]

const TONS = [
  { id: 'romantico', label: 'Romântico' },
  { id: 'poetico',   label: 'Poético'   },
  { id: 'divertido', label: 'Divertido' },
  { id: 'simples',   label: 'Simples'   },
]

interface DadosPagina {
  id: string
  nome_pessoa1: string
  nome_pessoa2: string
  data_inicio: string
  narrativa_ia: string
  tema: string
  musica_url: string
  colaboracao_ativa: boolean
}

function EditarContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const email = searchParams.get('email') ?? ''

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [gerandoNarrativa, setGerandoNarrativa] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState('')
  const [dados, setDados] = useState<DadosPagina | null>(null)
  const [tonSelecionado, setTonSelecionado] = useState('romantico')

  useEffect(() => {
    if (!email) { router.push('/dashboard'); return }
    carregarPagina()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const carregarPagina = async () => {
    setCarregando(true)
    try {
      const res = await fetch('/api/paginas/minhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      const pagina = data.paginas?.find((p: any) => p.slug === slug)
      if (!pagina) { router.push('/dashboard'); return }

      // Busca dados completos
      const resCompleto = await fetch(`/api/paginas/buscar?slug=${slug}&email=${encodeURIComponent(email)}`)
      const completo = await resCompleto.json()
      setDados(completo.pagina)
    } catch {
      setErro('Erro ao carregar a página.')
    } finally {
      setCarregando(false)
    }
  }

  const handleSalvar = async () => {
    if (!dados) return
    setSalvando(true)
    setErro('')
    try {
      const res = await fetch('/api/paginas/atualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          email,
          campos: {
            nome_pessoa1: dados.nome_pessoa1,
            nome_pessoa2: dados.nome_pessoa2,
            data_inicio: dados.data_inicio,
            tema: dados.tema,
            musica_url: dados.musica_url,
            narrativa_ia: dados.narrativa_ia,
            colaboracao_ativa: dados.colaboracao_ativa,
          },
        }),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      setSalvo(true)
      setTimeout(() => setSalvo(false), 3000)
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const handleRegenerarNarrativa = async () => {
    if (!dados) return
    setGerandoNarrativa(true)
    setErro('')
    try {
      const res = await fetch('/api/gerar-narrativa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: dados.id,
          nome1: dados.nome_pessoa1,
          nome2: dados.nome_pessoa2,
          dataInicio: dados.data_inicio,
          comoSeConheceram: '',
          momentos: [],
          apelidos: '',
          tom: tonSelecionado,
        }),
      })
      if (!res.ok) throw new Error('Erro na geração')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let texto = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          texto += decoder.decode(value)
          setDados(d => d ? { ...d, narrativa_ia: texto } : d)
        }
      }
    } catch {
      setErro('Erro ao regenerar narrativa.')
    } finally {
      setGerandoNarrativa(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9768F' }} />
      </div>
    )
  }

  if (!dados) return null

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
      <header className="border-b sticky top-0 z-10" style={{ background: 'white', borderColor: '#F5EDE3' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm" style={{ color: '#A0785A' }}>
            <ArrowLeft className="w-4 h-4" />
            Minhas páginas
          </Link>
          <div className="flex items-center gap-3">
            <Link href={`/p/${slug}`} target="_blank"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
              style={{ borderColor: '#F5EDE3', color: '#7a6070' }}>
              <ExternalLink className="w-3.5 h-3.5" />
              Ver página
            </Link>
            <button onClick={handleSalvar} disabled={salvando}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> :
               salvo ? <><Check className="w-4 h-4" /> Salvo!</> :
               'Salvar alterações'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: '#1a0e14' }}>
            Editando: {dados.nome_pessoa1} & {dados.nome_pessoa2}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#A0785A' }}>envelopelacrado.com.br/p/{slug}</p>
        </div>

        {erro && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{erro}</p>
          </div>
        )}

        {/* Dados básicos */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#F5EDE3' }}>
          <h2 className="font-semibold" style={{ color: '#1a0e14' }}>Dados do casal</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7a6070' }}>Nome 1</label>
              <input value={dados.nome_pessoa1}
                onChange={e => setDados(d => d ? { ...d, nome_pessoa1: e.target.value } : d)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9768F]"
                style={{ borderColor: '#F5EDE3' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7a6070' }}>Nome 2</label>
              <input value={dados.nome_pessoa2}
                onChange={e => setDados(d => d ? { ...d, nome_pessoa2: e.target.value } : d)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9768F]"
                style={{ borderColor: '#F5EDE3' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7a6070' }}>Data de início do relacionamento</label>
            <input type="date" value={dados.data_inicio}
              onChange={e => setDados(d => d ? { ...d, data_inicio: e.target.value } : d)}
              className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9768F]"
              style={{ borderColor: '#F5EDE3' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7a6070' }}>Link da música (YouTube)</label>
            <input value={dados.musica_url ?? ''}
              onChange={e => setDados(d => d ? { ...d, musica_url: e.target.value } : d)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9768F]"
              style={{ borderColor: '#F5EDE3' }} />
          </div>
        </section>

        {/* Tema */}
        <section className="bg-white rounded-2xl border p-6" style={{ borderColor: '#F5EDE3' }}>
          <h2 className="font-semibold mb-4" style={{ color: '#1a0e14' }}>Tema visual</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMAS.map(t => (
              <button key={t.id} onClick={() => setDados(d => d ? { ...d, tema: t.id } : d)}
                className="p-3 rounded-xl border-2 text-sm font-medium transition-all"
                style={{
                  borderColor: dados.tema === t.id ? t.cor : '#F5EDE3',
                  background: dados.tema === t.id ? `${t.cor}12` : 'white',
                  color: dados.tema === t.id ? t.cor : '#7a6070',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Narrativa */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#F5EDE3' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: '#1a0e14' }}>Narrativa da IA</h2>
            <div className="flex items-center gap-2">
              <select value={tonSelecionado} onChange={e => setTonSelecionado(e.target.value)}
                className="border rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                style={{ borderColor: '#F5EDE3', color: '#7a6070' }}>
                {TONS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <button onClick={handleRegenerarNarrativa} disabled={gerandoNarrativa}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-50"
                style={{ borderColor: '#C9768F', color: '#C9768F' }}>
                <RefreshCw className={`w-3 h-3 ${gerandoNarrativa ? 'animate-spin' : ''}`} />
                {gerandoNarrativa ? 'Gerando...' : 'Regenerar'}
              </button>
            </div>
          </div>
          <textarea
            value={dados.narrativa_ia ?? ''}
            onChange={e => setDados(d => d ? { ...d, narrativa_ia: e.target.value } : d)}
            rows={10}
            className="w-full border rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C9768F] resize-none"
            style={{ borderColor: '#F5EDE3', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: '#3a1a2a' }}
            placeholder="A narrativa aparece aqui..."
          />
          <p className="text-xs" style={{ color: '#A0785A' }}>
            Você pode editar o texto diretamente ou regenerar com a IA. Sem limite de regenerações para páginas pagas.
          </p>
        </section>

        {/* Botão salvar fixo no mobile */}
        <div className="sticky bottom-4">
          <motion.button onClick={handleSalvar} disabled={salvando}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-xl disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)', boxShadow: '0 8px 30px rgba(201,118,143,0.35)' }}>
            {salvando ? <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</> :
             salvo ? <><Check className="w-5 h-5" /> Salvo com sucesso!</> :
             'Salvar todas as alterações'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default function EditarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9768F' }} /></div>}>
      <EditarContent />
    </Suspense>
  )
}
