'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

/*
  SQL necessário no Supabase (rodar uma vez):

  create table if not exists reacoes (
    id uuid primary key default gen_random_uuid(),
    page_id uuid references pages(id) on delete cascade,
    tipo text not null check (tipo in ('coracao', 'emotivo', 'apaixonado')),
    created_at timestamp default now()
  );
  alter table reacoes enable row level security;
  create policy "Leitura pública de reações" on reacoes for select using (true);
  create policy "Qualquer um pode reagir" on reacoes for insert with check (true);
*/

const OPCOES = [
  { tipo: 'coracao',     emoji: '❤️',  label: 'Amei' },
  { tipo: 'emotivo',    emoji: '🥹',  label: 'Me emocionei' },
  { tipo: 'apaixonado', emoji: '😍', label: 'Que lindo!' },
] as const

type Tipo = typeof OPCOES[number]['tipo']
type Contagem = Record<Tipo, number>

interface Props {
  pageId: string
  tema?: string
}

const CORES: Record<string, { titulo: string; acento: string; cardAtivo: string; cardInativo: string; border: string }> = {
  classico: {
    titulo: '#F0E4D4',
    acento: '#C9768F',
    cardAtivo:  'rgba(201,118,143,0.28)',
    cardInativo: 'rgba(255,255,255,0.07)',
    border: 'rgba(201,118,143,0.35)',
  },
  escuro: {
    titulo: '#E8D5B7',
    acento: '#C9A96E',
    cardAtivo:  'rgba(201,169,110,0.28)',
    cardInativo: 'rgba(255,255,255,0.06)',
    border: 'rgba(201,169,110,0.35)',
  },
  pastel: {
    titulo: '#E8E0F0',
    acento: '#9b6fbd',
    cardAtivo:  'rgba(155,111,189,0.28)',
    cardInativo: 'rgba(255,255,255,0.07)',
    border: 'rgba(155,111,189,0.35)',
  },
  floral: {
    titulo: '#E0F0DE',
    acento: '#7a9e78',
    cardAtivo:  'rgba(122,158,120,0.28)',
    cardInativo: 'rgba(255,255,255,0.07)',
    border: 'rgba(122,158,120,0.35)',
  },
}

const LS_KEY = (pageId: string) => `el_reacoes_${pageId}`

export default function Reacoes({ pageId, tema = 'classico' }: Props) {
  const [contagem, setContagem] = useState<Contagem>({ coracao: 0, emotivo: 0, apaixonado: 0 })
  const [jaReagiu, setJaReagiu] = useState<Set<Tipo>>(new Set())
  const [burst, setBurst] = useState<Tipo | null>(null)
  const c = CORES[tema] ?? CORES.classico

  useEffect(() => {
    // Restaurar reações salvas localmente
    try {
      const salvo = JSON.parse(localStorage.getItem(LS_KEY(pageId)) ?? '[]') as Tipo[]
      setJaReagiu(new Set(salvo))
    } catch {}

    // Carregar contagens
    const supabase = createClient()
    supabase
      .from('reacoes')
      .select('tipo')
      .eq('page_id', pageId)
      .then(({ data }) => {
        if (!data) return
        setContagem({
          coracao:    data.filter(r => r.tipo === 'coracao').length,
          emotivo:    data.filter(r => r.tipo === 'emotivo').length,
          apaixonado: data.filter(r => r.tipo === 'apaixonado').length,
        })
      })
  }, [pageId])

  const reagir = (tipo: Tipo) => {
    if (jaReagiu.has(tipo)) return

    // Atualização otimista
    setContagem(prev => ({ ...prev, [tipo]: prev[tipo] + 1 }))
    const novoSet = new Set([...jaReagiu, tipo])
    setJaReagiu(novoSet)
    try { localStorage.setItem(LS_KEY(pageId), JSON.stringify([...novoSet])) } catch {}

    setBurst(tipo)
    setTimeout(() => setBurst(null), 700)

    // Persistir
    createClient().from('reacoes').insert({ page_id: pageId, tipo })
  }

  return (
    <section className="py-16 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-sm mx-auto"
      >
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-8"
          style={{ color: c.acento }}
        >
          ✦ o que você sentiu? ✦
        </p>

        <div className="flex justify-center gap-3">
          {OPCOES.map(({ tipo, emoji, label }) => {
            const ativo = jaReagiu.has(tipo)
            const isBurst = burst === tipo

            return (
              /* div em vez de button — evita comportamentos de disabled em mobile */
              <div
                key={tipo}
                role="button"
                tabIndex={ativo ? -1 : 0}
                aria-pressed={ativo}
                onClick={() => reagir(tipo)}
                onKeyDown={e => e.key === 'Enter' && reagir(tipo)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 16px',
                  borderRadius: 20,
                  border: `1.5px solid ${ativo ? c.acento : c.border}`,
                  background: ativo ? c.cardAtivo : c.cardInativo,
                  cursor: ativo ? 'default' : 'pointer',
                  minWidth: 88,
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.15s ease, background 0.2s',
                  position: 'relative',
                  // Garante que nada acima bloqueia o clique
                  zIndex: 10,
                }}
              >
                {/* Emoji */}
                <div style={{ position: 'relative', fontSize: 32, lineHeight: 1 }}>
                  <span>{emoji}</span>

                  <AnimatePresence>
                    {isBurst && (
                      <motion.span
                        key="burst"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 32,
                          pointerEvents: 'none',
                        }}
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 2.8, opacity: 0 }}
                        exit={{}}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                      >
                        {emoji}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contagem */}
                <motion.span
                  key={contagem[tipo]}
                  initial={{ scale: 1.4, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: ativo ? c.acento : c.titulo,
                  }}
                >
                  {contagem[tipo]}
                </motion.span>

                <span style={{ fontSize: 11, color: c.titulo, opacity: 0.5 }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
