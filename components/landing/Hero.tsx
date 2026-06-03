'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #FAFAF8 0%, #F5EDE3 50%, #FAFAF8 100%)' }}>

      {/* Orbs decorativos */}
      {[
        { w: 500, h: 500, x: '-5%',  y: '-10%', color: '#C9768F', dur: 10 },
        { w: 400, h: 400, x: '80%',  y: '60%',  color: '#C9A96E', dur: 13 },
        { w: 350, h: 350, x: '60%',  y: '-20%', color: '#C9768F', dur: 9  },
      ].map((orb, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ width: orb.w, height: orb.h, left: orb.x, top: orb.y,
            background: orb.color, borderRadius: '50%', filter: 'blur(90px)', opacity: 0.08, transform: 'translate(-50%,-50%)' }}
          animate={{ x: [0,20,-12,8,0], y: [0,-16,14,-6,0], opacity:[0.08,0.13,0.06,0.1,0.08] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center w-full">

        {/* LEFT — texto */}
        <div>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border"
            style={{ borderColor: '#C9768F33', background: 'rgba(201,118,143,0.06)' }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-[#C9A96E] text-[#C9A96E]" />)}
            </div>
            <span className="text-xs font-medium" style={{ color: '#8a5a6a' }}>
              +2.000 casais emocionados
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: '#1a0e14' }}>
            A história de vocês,{' '}
            <span style={{ background: 'linear-gradient(135deg, #C9768F, #C9A96E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              lacrada com amor
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg leading-relaxed mb-10" style={{ color: '#7a5a6a', maxWidth: 480 }}>
            Descreva o relacionamento e a IA escreve uma narrativa poética única.
            Entregue via QR Code — o presente digital que emociona de verdade.
          </motion.p>

          {/* CTAs */}
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
            <a href="#demo">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium border transition-colors"
                style={{ borderColor: '#C9768F44', color: '#C9768F', background: 'white' }}>
                💌 Ver exemplo
              </motion.button>
            </a>
          </motion.div>

          {/* Prova social */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {['#C9768F','#C9A96E','#9B8EC4','#7D9B76'].map((c,i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
                  style={{ background: c }}>
                  {['😍','🥰','❤️','💕'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1a0e14' }}>Mais de 2.000 histórias criadas</p>
              <p className="text-xs" style={{ color: '#A0785A' }}>Dia dos Namorados, aniversários, pedidos de namoro</p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — mockup escuro (contraste intencional) */}
        <motion.div id="demo" initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16,1,0.3,1] }}
          className="relative hidden lg:block">

          <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20"
            style={{ background: 'linear-gradient(135deg, #C9768F, #C9A96E)', transform: 'scale(0.85) translateY(20px)' }} />

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border"
            style={{ borderColor: '#E8C8A8', background: '#1a0e0e' }}>

            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: '#110808', borderColor: '#2a1818' }}>
              <div className="flex gap-1.5">
                {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              </div>
              <div className="flex-1 rounded-full px-3 py-1 text-xs text-center" style={{ background: '#1e1010', color: '#6a5858' }}>
                envelopelacrado.com.br/p/ana-e-joao-k3m9
              </div>
            </div>

            <div className="p-8" style={{ background: 'linear-gradient(160deg, #0D0D0D, #1a0e0e)' }}>
              <p className="text-xs tracking-widest uppercase text-center mb-3" style={{ color: '#C9768F' }}>✦ unidos há ✦</p>
              <div className="flex items-center justify-center gap-2 mb-5">
                {[{v:'02',l:'anos'},{v:'03',l:'meses'},{v:'14',l:'dias'}].map((u) => (
                  <div key={u.l} className="flex flex-col items-center gap-1">
                    <div className="rounded-lg px-3 py-2 font-display font-bold text-xl"
                      style={{ background: 'rgba(201,118,143,0.1)', color: '#C9A96E', border: '1px solid #3a2828' }}>
                      {u.v}
                    </div>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: '#6a5858' }}>{u.l}</span>
                  </div>
                ))}
                <span className="font-bold text-xl mb-4" style={{ color: '#3a2828' }}>·</span>
                {[{v:'08',l:'horas'},{v:'42',l:'min'},{v:'17',l:'seg'}].map((u) => (
                  <div key={u.l} className="flex flex-col items-center gap-1">
                    <div className="rounded-lg px-3 py-2 font-display font-bold text-xl"
                      style={{ background: 'rgba(201,118,143,0.1)', color: '#C9A96E', border: '1px solid #3a2828' }}>
                      {u.v}
                    </div>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: '#6a5858' }}>{u.l}</span>
                  </div>
                ))}
              </div>
              <h2 className="font-display text-3xl font-bold text-center mb-1" style={{ color: '#F5EDE3' }}>Ana & João</h2>
              <div className="w-12 h-px mx-auto mb-4" style={{ background: '#C9768F' }} />
              <p className="text-sm leading-relaxed text-center italic" style={{ color: '#8a6a6a', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem' }}>
                &ldquo;Foi numa tarde de outubro que Ana e João descobriram que o acaso tem um jeito próprio de apresentar pessoas que vão mudar tudo...&rdquo;
              </p>
              <div className="grid grid-cols-3 gap-2 mt-6">
                {['🎭 Primeiro encontro','✈️ Primeira viagem','💍 Pedido'].map((m) => (
                  <div key={m} className="rounded-xl p-2 text-center text-xs" style={{ background: 'rgba(201,118,143,0.08)', color: '#8a6a6a', border: '1px solid #2a1818' }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.div animate={{ y: [-4,4,-4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-4 -left-6 rounded-2xl px-4 py-3 shadow-xl border"
            style={{ background: 'white', borderColor: '#F5EDE3' }}>
            <p className="text-xs font-semibold" style={{ color: '#C9768F' }}>💌 Surpresa pronta!</p>
            <p className="text-xs" style={{ color: '#A0785A' }}>Entregue por QR Code</p>
          </motion.div>

          <motion.div animate={{ y: [4,-4,4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -top-4 -right-4 rounded-2xl px-4 py-3 shadow-xl border"
            style={{ background: 'white', borderColor: '#F5EDE3' }}>
            <p className="text-xs font-semibold" style={{ color: '#C9A96E' }}>✨ IA escrevendo...</p>
            <p className="text-xs" style={{ color: '#A0785A' }}>Narrativa única</p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <p className="text-xs tracking-widest uppercase" style={{ color: '#C9768F44' }}>scroll</p>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #C9768F66, transparent)' }} />
      </motion.div>
    </section>
  )
}
