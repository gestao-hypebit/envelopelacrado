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
    bg: '#FEF2F5',
    borda: '#F5C6D4',
    detalhe: 'Formulário guiado passo a passo',
  },
  {
    num: '02',
    icon: Sparkles,
    titulo: 'A IA escreve',
    desc: 'Nossa IA transforma os detalhes em uma narrativa poética e única — você vê o texto aparecer em tempo real.',
    cor: '#C9A96E',
    bg: '#FEF9F0',
    borda: '#F5DFA8',
    detalhe: 'Powered by Claude (Anthropic)',
  },
  {
    num: '03',
    icon: Gift,
    titulo: 'Surpreende',
    desc: 'Receba o link e o QR Code por email. Imprima, mande pelo WhatsApp — e aguarde a reação.',
    cor: '#9B8EC4',
    bg: '#F4F2FC',
    borda: '#D0C8EC',
    detalhe: 'QR Code + link vitalício',
  },
]

export default function ComoFunciona() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20">
          <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#C9768F' }}>
            simples assim
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ color: '#1a0e14' }}>
            Em 3 passos, a surpresa está pronta
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: '#A0785A' }}>
            Da ideia à emoção em menos de 10 minutos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Linha conectora */}
          <div className="hidden md:block absolute top-14 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px"
            style={{ background: 'linear-gradient(to right, #C9768F44, #C9A96E44, #9B8EC444)' }} />

          {passos.map((p, i) => (
            <motion.div key={p.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}>
              <div className="rounded-2xl p-8 h-full border transition-all hover:shadow-md"
                style={{ background: p.bg, borderColor: p.borda }}>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'white', border: `1px solid ${p.borda}`, boxShadow: `0 2px 8px ${p.cor}18` }}>
                    <p.icon className="w-5 h-5" style={{ color: p.cor }} />
                  </div>
                  <span className="font-display font-bold text-5xl" style={{ color: `${p.cor}18` }}>
                    {p.num}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1a0e14' }}>
                  {p.titulo}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#8a6a6a' }}>
                  {p.desc}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'white', color: p.cor, border: `1px solid ${p.borda}` }}>
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
