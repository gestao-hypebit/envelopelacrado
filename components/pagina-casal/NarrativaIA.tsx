'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface NarrativaIAProps {
  narrativa: string
  tema?: string
}

const CORES: Record<string, { texto: string; acento: string; sub: string }> = {
  classico: { texto: '#F0E4D4', acento: '#C9768F', sub: 'rgba(240,228,212,0.38)' },
  escuro:   { texto: '#E8D5B7', acento: '#C9A96E', sub: 'rgba(232,213,183,0.38)' },
  pastel:   { texto: '#E8E0F0', acento: '#9b6fbd', sub: 'rgba(232,224,240,0.38)' },
  floral:   { texto: '#E0F0DE', acento: '#7a9e78', sub: 'rgba(224,240,222,0.38)' },
}

export default function NarrativaIA({ narrativa, tema = 'classico' }: NarrativaIAProps) {
  const { texto: corTexto, acento: corAcento, sub: corSub } = CORES[tema] ?? CORES.classico
  const reduceMotion = useReducedMotion()

  const paragrafos = narrativa
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10 sm:mb-16 justify-center"
        >
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${corAcento})` }} />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: corAcento }} />
            <span className="text-sm font-medium tracking-widest uppercase" style={{ color: corAcento }}>
              Nossa história
            </span>
            <Sparkles className="w-4 h-4" style={{ color: corAcento }} />
          </div>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${corAcento})` }} />
        </motion.div>

        {/* Livro aberto */}
        <div className="relative">
          {/* Linha central vertical */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: `linear-gradient(to bottom, transparent, ${corAcento}44, transparent)` }}
          />

          <div className="space-y-7 sm:space-y-12">
            {paragrafos.map((paragrafo, index) => {
              const esquerda = index % 2 === 0
              const ultimo = index === paragrafos.length - 1

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : (esquerda ? -20 : 20) }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: reduceMotion ? 0.3 : 0.7, delay: 0.1 }}
                  className={`relative md:w-[46%] ${esquerda ? 'md:ml-0 md:mr-auto md:pr-8' : 'md:ml-auto md:mr-0 md:pl-8'} ${esquerda ? 'narrativa-esquerda' : 'narrativa-direita'}`}
                >
                  {/* Ponto na linha central */}
                  <div
                    className={`absolute top-2 hidden md:block w-2.5 h-2.5 rounded-full border-2 ${esquerda ? '-right-[calc(8%+5px)]' : '-left-[calc(8%+5px)]'}`}
                    style={{ background: corAcento, borderColor: 'rgba(0,0,0,0.6)' }}
                  />

                  {/* Texto */}
                  <p
                    className="leading-loose text-lg sm:text-xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: corTexto,
                      fontStyle: ultimo ? 'italic' : 'normal',
                    }}
                  >
                    {index === 0 && (
                      <span
                        className="float-left font-bold leading-none mr-2"
                        style={{
                          color: corAcento,
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 'clamp(3rem, 10vw, 4.5rem)',
                          lineHeight: '0.8',
                          marginTop: '0.1em',
                        }}
                      >
                        {paragrafo[0]}
                      </span>
                    )}
                    {index === 0 ? paragrafo.slice(1) : paragrafo}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Rodapé decorativo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-10 sm:mt-16"
        >
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-px" style={{ background: corAcento, opacity: 0.4 }} />
            <span style={{ color: corAcento, opacity: 0.6 }}>✦ ♥ ✦</span>
            <div className="w-10 h-px" style={{ background: corAcento, opacity: 0.4 }} />
          </div>
          <p className="text-xs mt-3" style={{ color: corSub }}>
            Narrativa criada com inteligência artificial
          </p>
        </motion.div>
      </div>
    </section>
  )
}
