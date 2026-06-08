'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

/* ─── Counter mock ─── */
function pad(n: number) { return String(n).padStart(2, '0') }

function useContadorMock() {
  const init = Math.floor(2 * 365.25 * 86400 + 3 * 30.44 * 86400 + 14 * 86400 + 8 * 3600 + 42 * 60 + 17)
  const [s, setS] = useState(init)
  useEffect(() => {
    const id = setInterval(() => setS(v => v + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return {
    anos:    Math.floor(s / (365.25 * 86400)),
    meses:   Math.floor((s % (365.25 * 86400)) / (30.44 * 86400)),
    dias:    Math.floor((s % (30.44 * 86400)) / 86400),
    horas:   Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segs:    s % 60,
  }
}

/* ─── Dados mock ─── */
const NARRATIVA_MOCK = [
  'oi numa tarde de outubro, num café no centro que já não existe mais, que Ana e João descobriram que o acaso tem um jeito próprio de apresentar pessoas que vão mudar tudo. Ele chegou atrasado, ela estava prestes a ir embora — trinta segundos a mais e essa história não existiria.',
  'Mas ela ficou. E naquele momento, sem saber, começou a maior aventura das suas vidas.',
]

const MOMENTOS_MOCK = [
  { emoji: '☕', titulo: 'Primeiro encontro', data: 'Out 2023', bg: 'linear-gradient(135deg,#5c2a3a,#3a1a24)', rot: -3 },
  { emoji: '✈️', titulo: 'Porto de Galinhas', data: 'Jan 2024', bg: 'linear-gradient(135deg,#3a2a0a,#241a06)', rot: 2  },
  { emoji: '💍', titulo: 'Pedido oficial',    data: 'Mar 2024', bg: 'linear-gradient(135deg,#2a1a3a,#1a0e28)', rot: -2 },
]

/* ─── Seção: Contador ─── */
function SecaoContador({ c }: { c: ReturnType<typeof useContadorMock> }) {
  const partes = [
    c.anos  > 0 ? `${c.anos} ${c.anos  === 1 ? 'ano'  : 'anos'}`  : null,
    c.meses > 0 ? `${c.meses} ${c.meses === 1 ? 'mês' : 'meses'}` : null,
    `${c.dias} ${c.dias === 1 ? 'dia' : 'dias'}`,
  ].filter(Boolean).join(' · ')

  return (
    <div className="relative overflow-hidden text-center" style={{ background: 'linear-gradient(155deg,#1e0818,#0d0612)', padding: '24px 16px' }}>
      <div className="absolute rounded-full pointer-events-none" style={{ width: 180, height: 180, left: '-5%', top: '-8%', background: '#C9768F', filter: 'blur(60px)', opacity: 0.13 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 140, height: 140, right: '-3%', bottom: '5%', background: '#C9A96E', filter: 'blur(50px)', opacity: 0.1 }} />

      {/* Foto */}
      <div className="flex justify-center mb-4">
        <div className="rounded-2xl flex items-center justify-center text-2xl relative"
          style={{ width: 96, height: 126, background: 'linear-gradient(135deg,#5c2a3a,#3a1a24)', boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 2px rgba(201,118,143,0.3)' }}>
          📸
          {[-1, 1].map((d, i) => (
            <div key={i} className="absolute rounded-xl" style={{ width: 72, height: 104, top: '50%', left: '50%', transform: `translate(calc(-50% + ${d * 40}px), -50%) scale(0.82)`, background: d < 0 ? 'linear-gradient(135deg,#3a2a0a,#241a06)' : 'linear-gradient(135deg,#2a1a3a,#1a0e28)', opacity: 0.55, zIndex: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.45)' }} />
          ))}
        </div>
      </div>

      {/* Nomes */}
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '1.3rem', fontWeight: 700, color: '#F0E4D4', lineHeight: 1.1, marginBottom: 4 }}>
        Ana<span style={{ color: '#C9768F' }}> &amp; </span>João
      </h2>
      <div style={{ width: 40, height: 1, background: 'linear-gradient(to right,transparent,#C9768F,transparent)', margin: '0 auto 10px' }} />

      <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9768F', marginBottom: 6 }}>✦ unidos há ✦</p>

      <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '1rem', fontWeight: 700, color: '#F0E4D4', marginBottom: 2 }}>
        {partes}
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(240,228,212,0.38)' }}>
        {pad(c.horas)}h {pad(c.minutos)}min {pad(c.segs)}s
      </p>
      <p style={{ fontSize: '0.6rem', marginTop: 10, color: 'rgba(240,228,212,0.3)', letterSpacing: '0.06em' }}>e contando, segundo a segundo</p>
    </div>
  )
}

/* ─── Seção: Narrativa ─── */
function SecaoNarrativa() {
  return (
    <div style={{ padding: '24px 20px', background: '#18081c' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right,transparent,#C9768F)' }} />
        <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9768F' }}>✦ Nossa história ✦</span>
        <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left,transparent,#C9768F)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NARRATIVA_MOCK.map((p, i) => (
          <p key={i} style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '0.88rem', lineHeight: 1.85, color: '#F0E4D4' }}>
            {i === 0 && (
              <span style={{ float: 'left', fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', lineHeight: 0.8, color: '#C9768F', marginRight: 5, marginTop: 4 }}>
                F
              </span>
            )}
            {i === 0 ? p : p}
          </p>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <span style={{ color: '#C9768F', opacity: 0.5, fontSize: '0.8rem' }}>✦ ♥ ✦</span>
        <p style={{ fontSize: '0.6rem', marginTop: 4, color: 'rgba(240,228,212,0.3)' }}>Narrativa criada com inteligência artificial</p>
      </div>
    </div>
  )
}

/* ─── Seção: Polaroids ─── */
function SecaoTimeline() {
  return (
    <div style={{ padding: '24px 16px', background: '#0d0612' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9768F' }}>A nossa jornada</span>
        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '0.95rem', fontWeight: 700, color: '#F0E4D4', marginTop: 2 }}>Momentos que ficaram</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {MOMENTOS_MOCK.map((m, i) => (
          <div key={i} style={{ transform: `rotate(${m.rot}deg)`, transformOrigin: 'center bottom' }}>
            <div style={{ padding: '6px 6px 22px', background: '#f0e8e0', boxShadow: '0 8px 24px rgba(0,0,0,0.55)' }}>
              <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', background: m.bg, borderRadius: 4 }}>
                {m.emoji}
              </div>
              <div style={{ paddingTop: 6, textAlign: 'center' }}>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: '0.55rem', color: '#333', lineHeight: 1.3 }}>{m.titulo}</p>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: '0.5rem', color: '#C9768F', opacity: 0.8, marginTop: 2 }}>{m.data}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Preview compacto da página do casal ─── */
function CouplePagePreview() {
  const c = useContadorMock()

  return (
    <div className="relative">

      {/* Glow */}
      <div className="absolute rounded-3xl blur-3xl opacity-20 pointer-events-none" style={{ inset: -20, background: 'linear-gradient(135deg,#C9768F,#C9A96E)', transform: 'scale(0.9) translateY(20px)' }} />

      {/* Browser shell */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: '#1e1010' }}>

        {/* Barra do browser */}
        <div className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0" style={{ background: '#0a0406', borderColor: '#1a0808' }}>
          <div className="flex gap-1.5 flex-shrink-0">
            {['#ff5f57', '#febc2e', '#28c840'].map((cor, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: cor }} />
            ))}
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-3 py-1 rounded text-xs" style={{ background: '#1a0808', color: '#6a5858', fontFamily: 'monospace' }}>
              🔒 memoriai.com.br/p/<span style={{ color: '#C9768F', opacity: 0.9 }}>ana-e-joao-k3m9</span>
            </div>
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: 'rgba(40,200,64,0.15)', color: '#28c840', border: '1px solid rgba(40,200,64,0.2)' }}>
            AO VIVO
          </div>
        </div>

        {/* Conteúdo da página — com fade na base */}
        <div className="relative" style={{ maxHeight: 520, overflowY: 'hidden' }}>
          <SecaoContador c={c} />
          <div style={{ height: 16, background: 'linear-gradient(to bottom,#0d0612,#18081c)' }} />
          <SecaoNarrativa />
          <div style={{ height: 16, background: 'linear-gradient(to bottom,#18081c,#0d0612)' }} />
          <SecaoTimeline />

          {/* Fade na base indicando que há mais conteúdo */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 80, background: 'linear-gradient(to bottom,transparent,#0d0612)' }} />
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <span style={{ fontSize: '0.6rem', color: 'rgba(201,118,143,0.45)', letterSpacing: '0.15em' }}>↓ role para ver mais ↓</span>
          </div>
        </div>
      </div>

      {/* Badge flutuante — esquerda */}
      <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-6 rounded-2xl px-4 py-3 shadow-xl border"
        style={{ background: 'white', borderColor: '#F5EDE3', zIndex: 10 }}>
        <p className="text-xs font-semibold" style={{ color: '#C9768F' }}>💌 Surpresa pronta!</p>
        <p className="text-xs" style={{ color: '#A0785A' }}>Entregue por QR Code</p>
      </motion.div>

      {/* Badge flutuante — direita */}
      <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-4 -right-4 rounded-2xl px-4 py-3 shadow-xl border"
        style={{ background: 'white', borderColor: '#F5EDE3', zIndex: 10 }}>
        <p className="text-xs font-semibold" style={{ color: '#C9A96E' }}>✨ IA gerou em segundos</p>
        <p className="text-xs" style={{ color: '#A0785A' }}>Narrativa única</p>
      </motion.div>
    </div>
  )
}

/* ─── Hero ─── */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #FAFAF8 0%, #F5EDE3 50%, #FAFAF8 100%)' }}>

      {[
        { w: 500, h: 500, x: '-5%',  y: '-10%', color: '#C9768F', dur: 10 },
        { w: 400, h: 400, x: '80%',  y: '60%',  color: '#C9A96E', dur: 13 },
        { w: 350, h: 350, x: '60%',  y: '-20%', color: '#C9768F', dur: 9  },
      ].map((orb, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ width: orb.w, height: orb.h, left: orb.x, top: orb.y, background: orb.color, borderRadius: '50%', filter: 'blur(90px)', opacity: 0.08, transform: 'translate(-50%,-50%)' }}
          animate={{ x: [0,20,-12,8,0], y: [0,-16,14,-6,0], opacity: [0.08,0.13,0.06,0.1,0.08] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center w-full">

        {/* ── LEFT ── */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border"
            style={{ borderColor: '#C9768F33', background: 'rgba(201,118,143,0.06)' }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#C9A96E] text-[#C9A96E]" />)}
            </div>
            <span className="text-xs font-medium" style={{ color: '#8a5a6a' }}>+2.000 casais emocionados</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: '#1a0e14' }}>
            A história de vocês,{' '}
            <span style={{ background: 'linear-gradient(135deg, #C9768F, #C9A96E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              narrada pela IA
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg leading-relaxed mb-10" style={{ color: '#7a5a6a', maxWidth: 480 }}>
            Descreva o relacionamento e a IA escreve uma narrativa poética única.
            Entregue via QR Code — o presente digital que emociona de verdade.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link href="/criar">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)', boxShadow: '0 8px 30px rgba(201,118,143,0.35)' }}>
                Criar minha surpresa
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <a href="#demo-preview">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium border transition-colors"
                style={{ borderColor: '#C9768F44', color: '#C9768F', background: 'white' }}>
                💌 Ver exemplo completo
              </motion.button>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {['#C9768F', '#C9A96E', '#9B8EC4', '#7D9B76'].map((c, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs"
                  style={{ background: c }}>
                  {['😍', '🥰', '❤️', '💕'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1a0e14' }}>Mais de 2.000 histórias criadas</p>
              <p className="text-xs" style={{ color: '#A0785A' }}>Dia dos Namorados, aniversários, pedidos de namoro</p>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT — Preview da página do casal ── */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <CouplePagePreview />
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <p className="text-xs tracking-widest uppercase" style={{ color: '#C9768F44' }}>scroll</p>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #C9768F66, transparent)' }} />
      </motion.div>
    </section>
  )
}
