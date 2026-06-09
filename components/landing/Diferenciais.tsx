'use client'

import { motion } from 'framer-motion'
import { Brain, Timer, Users, MessageCircleHeart } from 'lucide-react'
import Link from 'next/link'
import { fbq } from '@/components/MetaPixel'

const superpoderes = [
  {
    icon: Brain,
    cor: '#C9768F',
    borda: 'rgba(201,118,143,0.25)',
    bg: 'rgba(201,118,143,0.07)',
    glow: 'rgba(201,118,143,0.12)',
    titulo: 'IA narra a história deles',
    desc: 'Não é um texto genérico. Nossa IA usa os detalhes reais — como vocês se conheceram, os apelidos, os momentos marcantes — e escreve algo que só poderia ser de vocês dois.',
    tag: 'Exclusivo',
  },
  {
    icon: Timer,
    cor: '#C9A96E',
    borda: 'rgba(201,169,110,0.25)',
    bg: 'rgba(201,169,110,0.07)',
    glow: 'rgba(201,169,110,0.12)',
    titulo: 'Contador ao vivo',
    desc: 'A página mostra exatamente há quantos anos, meses, dias, horas e segundos vocês estão juntos — em tempo real. Detalhe que faz o homenageado parar e sorrir.',
    tag: 'Tempo real',
  },
  {
    icon: Users,
    cor: '#9B8EC4',
    borda: 'rgba(155,142,196,0.25)',
    bg: 'rgba(155,142,196,0.07)',
    glow: 'rgba(155,142,196,0.12)',
    titulo: 'Amigos e família colaboram',
    desc: 'Compartilhe um link secreto com quem você quiser. Cada um pode deixar uma mensagem e foto — um mural de amor coletivo que aparece na página.',
    tag: 'Colaborativo',
  },
  {
    icon: MessageCircleHeart,
    cor: '#7D9B76',
    borda: 'rgba(125,155,118,0.25)',
    bg: 'rgba(125,155,118,0.07)',
    glow: 'rgba(125,155,118,0.12)',
    titulo: 'Homenageado pode responder',
    desc: 'A pessoa que recebe a surpresa pode deixar uma resposta direto na página. O momento em que ela escreve de volta pra você é inesquecível.',
    tag: 'Interativo',
  },
]

export default function Diferenciais() {
  return (
    <section className="py-16 lg:py-32 px-6 lg:px-8" style={{ background: '#130818' }}>
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10 lg:mb-20">
          <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#C9768F' }}>
            só o Envelope Lacrado tem
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ color: '#F0E4D4' }}>
            Não é só uma página bonita
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: 'rgba(240,228,212,0.55)' }}>
            Outros entregam um template. Nós entregamos a história de vocês, narrada por IA.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {superpoderes.map((s, i) => (
            <motion.div key={s.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              <motion.div className="rounded-2xl p-5 sm:p-8 h-full border transition-all"
                style={{ background: s.bg, borderColor: s.borda }}
                whileHover={{ scale: 1.01, boxShadow: `0 8px 30px ${s.glow}` }}>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${s.borda}` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.cor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-lg" style={{ color: '#F0E4D4' }}>
                        {s.titulo}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(255,255,255,0.06)', color: s.cor, border: `1px solid ${s.borda}` }}>
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,228,212,0.6)' }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-10 lg:mt-16 rounded-2xl p-6 sm:p-8 text-center border"
          style={{ background: 'rgba(201,118,143,0.06)', borderColor: 'rgba(201,118,143,0.25)' }}>
          <p className="text-lg font-semibold mb-2" style={{ color: '#F0E4D4' }}>
            Um buquê murcha em 3 dias. Uma página aqui dura para sempre.
          </p>
          <p className="text-sm mb-6" style={{ color: 'rgba(240,228,212,0.5)' }}>
            R$ 19,90 · Pagamento único · Sem assinaturas
          </p>
          <Link href="/criar" onClick={() => fbq('track', 'Lead')}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-full font-semibold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)', boxShadow: '0 4px 20px rgba(201,118,143,0.35)' }}>
              Criar minha surpresa →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
