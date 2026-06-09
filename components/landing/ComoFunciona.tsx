'use client'

import { motion } from 'framer-motion'
import { PenLine, Sparkles, Gift } from 'lucide-react'

const passos = [
  {
    num: '01',
    icon: PenLine,
    titulo: 'Conta a história',
    desc: 'Descreve como se conheceram, os momentos marcantes, apelidos e escolhe o tema visual. Leva menos de 5 minutos.',
    cor: '#C9768F',
    borda: 'rgba(201,118,143,0.25)',
    bg: 'rgba(201,118,143,0.07)',
    detalhe: 'Formulário guiado passo a passo',
  },
  {
    num: '02',
    icon: Sparkles,
    titulo: 'A IA escreve',
    desc: 'Nossa IA transforma os detalhes em uma narrativa poética e única — você vê o texto aparecer em tempo real.',
    cor: '#C9A96E',
    borda: 'rgba(201,169,110,0.25)',
    bg: 'rgba(201,169,110,0.07)',
    detalhe: 'Powered by Claude (Anthropic)',
  },
  {
    num: '03',
    icon: Gift,
    titulo: 'Surpreende',
    desc: 'Receba o link e o QR Code por email. Imprima, mande pelo WhatsApp — e aguarde a reação.',
    cor: '#9B8EC4',
    borda: 'rgba(155,142,196,0.25)',
    bg: 'rgba(155,142,196,0.07)',
    detalhe: 'QR Code + link vitalício',
  },
]

export default function ComoFunciona() {
  return (
    <section className="py-32 px-6 lg:px-8" style={{ background: '#0d0612' }}>
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20">
          <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#C9768F' }}>
            simples assim
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ color: '#F0E4D4' }}>
            Em 3 passos, a surpresa está pronta
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: 'rgba(240,228,212,0.55)' }}>
            Da ideia à emoção em menos de 10 minutos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Linha conectora */}
          <div className="hidden md:block absolute top-14 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px"
            style={{ background: 'linear-gradient(to right, rgba(201,118,143,0.4), rgba(201,169,110,0.4), rgba(155,142,196,0.4))' }} />

          {passos.map((p, i) => (
            <motion.div key={p.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}>
              <div className="rounded-2xl p-8 h-full border transition-all"
                style={{ background: p.bg, borderColor: p.borda }}>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${p.borda}` }}>
                    <p.icon className="w-5 h-5" style={{ color: p.cor }} />
                  </div>
                  <span className="font-display font-bold text-5xl" style={{ color: `${p.cor}25` }}>
                    {p.num}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#F0E4D4' }}>
                  {p.titulo}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(240,228,212,0.6)' }}>
                  {p.desc}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.06)', color: p.cor, border: `1px solid ${p.borda}` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.cor }} />
                  {p.detalhe}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-sm mt-12" style={{ color: '#C9768F' }}>
          ⏱ Média de 8 minutos do início ao QR Code no email
        </motion.p>
      </div>
    </section>
  )
}
