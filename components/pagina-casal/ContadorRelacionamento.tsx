'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContador } from '@/hooks/useContador'

interface Props {
  dataInicio: string
  nome1: string
  nome2: string
  tema?: string
}

function FlipCard({ valor, label, corTexto, corFundo }: {
  valor: number
  label: string
  corTexto: string
  corFundo: string
}) {
  const exibir = String(valor).padStart(2, '0')
  const anterior = useRef(exibir)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (anterior.current !== exibir) {
      setFlipping(true)
      const t = setTimeout(() => {
        setFlipping(false)
        anterior.current = exibir
      }, 300)
      return () => clearTimeout(t)
    }
  }, [exibir])

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Flip clock card */}
      <div className="relative" style={{ perspective: '400px' }}>
        {/* Card superior (estático) */}
        <div
          className="w-16 sm:w-20 h-9 sm:h-11 rounded-t-lg flex items-end justify-center pb-0.5 overflow-hidden border-b border-black/10"
          style={{ background: corFundo }}
        >
          <span
            className="font-display font-bold text-2xl sm:text-3xl leading-none select-none"
            style={{ color: corTexto }}
          >
            {exibir}
          </span>
        </div>

        {/* Divisor horizontal */}
        <div className="w-full h-px" style={{ background: 'rgba(0,0,0,0.2)' }} />

        {/* Card inferior (estático) */}
        <div
          className="w-16 sm:w-20 h-9 sm:h-11 rounded-b-lg flex items-start justify-center pt-0.5 overflow-hidden"
          style={{ background: corFundo, filter: 'brightness(0.92)' }}
        >
          <span
            className="font-display font-bold text-2xl sm:text-3xl leading-none select-none"
            style={{ color: corTexto }}
          >
            {exibir}
          </span>
        </div>

        {/* Flip animation overlay */}
        <AnimatePresence>
          {flipping && (
            <motion.div
              className="absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ background: corFundo, zIndex: 10 }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ rotateX: -180 }}
              transition={{ duration: 0.25, ease: 'easeIn' }}
            >
              <span
                className="font-display font-bold text-2xl sm:text-3xl"
                style={{ color: corTexto }}
              >
                {anterior.current}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span
        className="text-xs uppercase tracking-widest font-medium"
        style={{ color: corTexto, opacity: 0.5 }}
      >
        {label}
      </span>
    </div>
  )
}

export default function ContadorRelacionamento({ dataInicio, nome1, nome2, tema = 'classico' }: Props) {
  const { anos, meses, dias, horas, minutos, segundos } = useContador(dataInicio)
  const escuro = tema === 'escuro'
  const corTexto = escuro ? '#C9A96E' : '#1a1a1a'
  const corFundo = escuro ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.8)'

  const unidades = [
    ...(anos > 0 ? [{ valor: anos, label: anos === 1 ? 'ano' : 'anos' }] : []),
    ...(meses > 0 ? [{ valor: meses, label: meses === 1 ? 'mês' : 'meses' }] : []),
    { valor: dias, label: dias === 1 ? 'dia' : 'dias' },
    { valor: horas, label: 'horas' },
    { valor: minutos, label: 'min' },
    { valor: segundos, label: 'seg' },
  ]

  return (
    <div className="py-20 px-4 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xs font-semibold tracking-widest uppercase mb-3"
        style={{ color: '#C9768F' }}
      >
        ✦ unidos há ✦
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-5xl sm:text-7xl font-bold mb-4 tracking-tight"
        style={{ color: corTexto }}
      >
        {nome1}
        <span style={{ color: '#C9768F' }}> & </span>
        {nome2}
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="h-px w-24 mx-auto mb-12"
        style={{ background: 'linear-gradient(to right, transparent, #C9768F, transparent)' }}
      />

      {/* Flip clock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-start justify-center gap-3 sm:gap-5"
      >
        {unidades.map((u, i) => (
          <div key={u.label} className="flex items-start gap-3 sm:gap-5">
            <FlipCard valor={u.valor} label={u.label} corTexto={corTexto} corFundo={corFundo} />
            {i < unidades.length - 1 && i !== 2 && (
              <span
                className="font-display text-3xl font-bold mt-1 opacity-30 select-none"
                style={{ color: corTexto }}
              >
                :
              </span>
            )}
            {i === 2 && (
              <div className="w-px h-14 self-center opacity-20" style={{ background: corTexto }} />
            )}
          </div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 0.8 }}
        className="text-sm mt-10"
        style={{ color: escuro ? '#E8D5B7' : '#888' }}
      >
        e contando, segundo a segundo
      </motion.p>
    </div>
  )
}
