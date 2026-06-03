'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import type { Momento } from '@/types'

interface TimeLineProps {
  momentos: Momento[]
  tema?: string
}

const ROTACOES = [-3, 2, -2, 3, -1.5, 2.5, -2.5, 1.5, -3.5, 2]

function PolaroidCard({ momento, index, tema }: { momento: Momento; index: number; tema: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const escuro = tema === 'escuro'
  const rotacao = ROTACOES[index % ROTACOES.length]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotate: rotacao }}
      animate={inView ? { opacity: 1, y: 0, rotate: rotacao } : {}}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 200 }}
      className="relative cursor-pointer"
      style={{ transformOrigin: 'center bottom' }}
    >
      {/* Polaroid */}
      <div
        className="p-3 pb-10 shadow-xl"
        style={{
          background: escuro ? '#f0e8e0' : '#fff',
          boxShadow: escuro
            ? '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {/* Foto */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100" style={{ minHeight: 160 }}>
          {momento.foto_url ? (
            <Image
              src={momento.foto_url}
              alt={momento.titulo}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-4xl"
              style={{ background: '#f5ede3' }}
            >
              📸
            </div>
          )}
        </div>

        {/* Legenda estilo escrita à mão */}
        <div className="pt-3 px-1 text-center">
          <p
            className="text-sm leading-tight"
            style={{
              fontFamily: "'Dancing Script', 'Pacifico', cursive",
              color: '#333',
              fontSize: '0.9rem',
            }}
          >
            {momento.titulo}
          </p>
          {momento.data && (
            <p
              className="text-xs mt-1 opacity-60"
              style={{ fontFamily: 'Georgia, serif', color: '#C9768F' }}
            >
              {new Date(momento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      {/* Sombra do polaroid */}
      <div
        className="absolute -bottom-2 left-2 right-2 h-4 blur-md opacity-30 -z-10"
        style={{ background: '#000' }}
      />
    </motion.div>
  )
}

export default function TimeLine({ momentos, tema = 'classico' }: TimeLineProps) {
  const [fontLoaded, setFontLoaded] = useState(false)
  const escuro = tema === 'escuro'

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap'
    document.head.appendChild(link)
    link.onload = () => setFontLoaded(true)
  }, [])

  if (!momentos || momentos.length === 0) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: '#C9768F' }}
          >
            A nossa jornada
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: escuro ? '#C9A96E' : '#1a1a1a' }}
          >
            Momentos que ficaram
          </h2>
          <p
            className="text-sm mt-2 opacity-60"
            style={{ color: escuro ? '#E8D5B7' : '#666' }}
          >
            Passe o mouse para ver melhor
          </p>
        </motion.div>

        {/* Grid de polaroids */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {momentos.map((momento, index) => (
            <PolaroidCard
              key={momento.id}
              momento={momento}
              index={index}
              tema={tema}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
