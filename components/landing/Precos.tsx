'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight, Infinity, ShieldCheck, Clock } from 'lucide-react'
import { fbq } from '@/components/MetaPixel'

const inclusos = [
  'Narrativa única gerada por IA',
  'Contador ao vivo do relacionamento',
  'Linha do tempo com até 8 fotos',
  'Galeria com lightbox interativo',
  'Modo colaborativo com amigos e família',
  'MessageBoard — homenageado responde',
  'Player de música integrado',
  'QR Code para imprimir e presentear',
  'Email de confirmação com QR Code',
  'Múltiplos temas visuais',
  'Página no ar para sempre',
]

const garantias = [
  { icon: Infinity, texto: 'Página vitalícia' },
  { icon: ShieldCheck, texto: 'Pagamento seguro' },
  { icon: Clock, texto: 'Pronto em minutos' },
]

export default function Precos() {
  return (
    <section className="py-32 px-6 lg:px-8" style={{ background: '#130818' }}>
      <div className="max-w-5xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#C9768F' }}>preço</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ color: '#F0E4D4' }}>
            Uma coisa só. Para sempre.
          </h2>
          <p className="text-lg" style={{ color: 'rgba(240,228,212,0.55)' }}>
            Sem assinatura. Sem mensalidade. Paga uma vez, a história fica para sempre.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border"
          style={{ borderColor: 'rgba(201,118,143,0.25)' }}>

          {/* LEFT — preço */}
          <div className="relative p-10 flex flex-col justify-between overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #1e0818, #130818)' }}>

            {/* Pink glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-25 blur-3xl"
              style={{ background: '#C9768F' }} />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
              style={{ background: '#C9A96E' }} />

            <div className="relative z-10">
              <p className="text-xs tracking-widest uppercase mb-6 font-semibold" style={{ color: '#C9768F' }}>
                Envelope Lacrado — Acesso completo
              </p>

              <div className="flex items-end gap-1 mb-2">
                <span className="text-xl font-medium mt-4" style={{ color: '#C9768F' }}>R$</span>
                <span className="font-display font-bold leading-none" style={{ fontSize: '6rem', color: '#F0E4D4' }}>19</span>
                <span className="text-3xl font-bold mb-3" style={{ color: '#F0E4D4' }}>,90</span>
              </div>
              <p className="text-sm mb-8" style={{ color: 'rgba(240,228,212,0.5)' }}>
                Pagamento único · Pix ou Cartão · Sem surpresas
              </p>

              <div className="space-y-3 mb-10">
                {garantias.map((g) => (
                  <div key={g.texto} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,118,143,0.2)' }}>
                      <g.icon className="w-4 h-4" style={{ color: '#C9768F' }} />
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(240,228,212,0.65)' }}>{g.texto}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <Link href="/criar" onClick={() => fbq('track', 'Lead')}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="group w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)', boxShadow: '0 8px 30px rgba(201,118,143,0.4)' }}>
                  Criar agora por R$ 19,90
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <p className="text-center text-xs mt-3" style={{ color: 'rgba(240,228,212,0.4)' }}>
                Menos de 10 minutos · QR Code por email
              </p>
            </div>
          </div>

          {/* RIGHT — features */}
          <div className="p-10" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(201,118,143,0.15)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: '#C9768F' }}>
              Tudo incluído
            </p>
            <ul className="space-y-3">
              {inclusos.map((item, i) => (
                <motion.li key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(201,118,143,0.12)', border: '1px solid rgba(201,118,143,0.25)' }}>
                    <Check className="w-3 h-3" style={{ color: '#C9768F' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(240,228,212,0.65)' }}>{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(240,228,212,0.08)' }}>
              <p className="text-xs text-center" style={{ color: 'rgba(240,228,212,0.4)' }}>
                Comparado a um jantar ou buquê —{' '}
                <span style={{ color: '#C9768F', fontWeight: 600 }}>a história dura para sempre.</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
