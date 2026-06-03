'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Loader2, Mail, Heart, ExternalLink, Edit, ArrowRight } from 'lucide-react'

interface Pagina {
  id: string
  slug: string
  nome_pessoa1: string
  nome_pessoa2: string
  data_inicio: string
  tema: string
  created_at: string
}

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [paginas, setPaginas] = useState<Pagina[] | null>(null)
  const [erro, setErro] = useState('')

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { setErro('Informe um email válido'); return }
    setBuscando(true)
    setErro('')
    try {
      const res = await fetch('/api/paginas/minhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPaginas(data.paginas)
    } catch {
      setErro('Erro ao buscar páginas. Tente novamente.')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
      <header className="border-b" style={{ background: 'white', borderColor: '#F5EDE3' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold" style={{ color: '#C9768F' }}>
            💌 Envelope Lacrado
          </Link>
          <Link href="/criar" className="text-sm font-medium" style={{ color: '#C9768F' }}>
            + Nova página
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: '#1a0e14' }}>
            Minhas páginas
          </h1>
          <p className="text-base" style={{ color: '#A0785A' }}>
            Acesse com o email que usou na compra para ver e editar suas páginas.
          </p>
        </div>

        <motion.form onSubmit={handleBuscar}
          className="bg-white rounded-2xl p-6 border mb-8 shadow-sm"
          style={{ borderColor: '#F5EDE3' }}>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1a0e14' }}>
            Seu email de compra
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C9768F' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-[#C9768F]"
                style={{ borderColor: '#F5EDE3', background: '#FAFAF8' }}
              />
            </div>
            <button type="submit" disabled={buscando}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
              {buscando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
            </button>
          </div>
          {erro && <p className="text-red-500 text-xs mt-2">{erro}</p>}
        </motion.form>

        <AnimatePresence>
          {paginas !== null && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {paginas.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border" style={{ background: 'white', borderColor: '#F5EDE3' }}>
                  <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: '#F5C6D4' }} />
                  <p className="font-semibold mb-1" style={{ color: '#1a0e14' }}>Nenhuma página encontrada</p>
                  <p className="text-sm mb-4" style={{ color: '#A0785A' }}>
                    Verifique o email ou crie sua primeira página.
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
                    <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
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
                        <Link href={`/editar/${p.slug}?email=${encodeURIComponent(email)}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
                          <Edit className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
