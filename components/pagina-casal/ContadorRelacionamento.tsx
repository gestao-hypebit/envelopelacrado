'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { useContador } from '@/hooks/useContador'
import { useIsMobile } from '@/hooks/useIsMobile'

interface Props {
  dataInicio: string
  nome1: string
  nome2: string
  tema?: string
  fotos?: string[]
}

const HERO_BG: Record<string, string> = {
  classico: 'linear-gradient(155deg, #1e0818 0%, #0d0612 100%)',
  escuro:   'linear-gradient(155deg, #1a1010 0%, #0D0D0D 100%)',
  pastel:   'linear-gradient(155deg, #15083a 0%, #0a0618 100%)',
  floral:   'linear-gradient(155deg, #0c1e0a 0%, #060c06 100%)',
}

const CORES: Record<string, { texto: string; acento: string; label: string }> = {
  classico: { texto: '#F0E4D4', acento: '#C9768F', label: 'rgba(240,228,212,0.42)' },
  escuro:   { texto: '#E8D5B7', acento: '#C9A96E', label: 'rgba(232,213,183,0.42)' },
  pastel:   { texto: '#E8E0F0', acento: '#9b6fbd', label: 'rgba(232,224,240,0.42)' },
  floral:   { texto: '#E0F0DE', acento: '#7a9e78', label: 'rgba(224,240,222,0.42)' },
}

const CARD_W = 176
const CARD_H = 230
const OFFSET  = 66

/* ── Carrossel com tilt 3D ── */
function FotoCarousel({ fotos, acento, skipAnimations }: { fotos: string[]; acento: string; skipAnimations: boolean }) {
  const [atual, setAtual] = useState(0)
  const total = fotos.length

  // Motion values para tilt 3D — não provocam re-render
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const springRX = useSpring(rotX, { stiffness: 320, damping: 28 })
  const springRY = useSpring(rotY, { stiffness: 320, damping: 28 })

  // Swipe touch
  const touchStartX = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (total <= 1) return
    intervalRef.current = setInterval(() => setAtual(a => (a + 1) % total), 4500)
  }

  useEffect(() => {
    resetInterval()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) < 38) return
    if (delta > 0) setAtual(a => (a - 1 + total) % total)
    else setAtual(a => (a + 1) % total)
    resetInterval()
  }

  if (total === 0) return null

  const getDiff = (idx: number) => {
    let d = ((idx - atual) % total + total) % total
    if (d > total / 2) d -= total
    return d
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotX.set(((e.clientY - cy) / (rect.height / 2)) * -9)
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 11)
  }

  const handleMouseLeave = () => {
    rotX.set(0)
    rotY.set(0)
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <div
        className="relative overflow-hidden"
        style={{ width: CARD_W + OFFSET * 2, height: CARD_H }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {fotos.map((foto, idx) => {
          const d = getDiff(idx)
          if (Math.abs(d) > 1) return null
          const isCenter = d === 0

          return (
            <motion.div
              key={idx}
              className="absolute rounded-2xl overflow-hidden"
              style={{
                width: CARD_W,
                height: CARD_H,
                left: '50%',
                top: 0,
                marginLeft: -CARD_W / 2,
                cursor: isCenter ? 'default' : 'pointer',
                boxShadow: isCenter
                  ? `0 16px 48px rgba(0,0,0,0.65), 0 0 0 2px ${acento}50`
                  : '0 6px 24px rgba(0,0,0,0.45)',
                transformPerspective: 600,
                // Tilt 3D só no card central em desktop
                rotateX: isCenter && !skipAnimations ? springRX : 0,
                rotateY: isCenter && !skipAnimations ? springRY : 0,
              }}
              animate={{
                x: d * OFFSET,
                scale: isCenter ? 1 : 0.82,
                opacity: isCenter ? 1 : 0.55,
                zIndex: isCenter ? 3 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onMouseMove={isCenter && !skipAnimations ? handleMouseMove : undefined}
              onMouseLeave={isCenter && !skipAnimations ? handleMouseLeave : undefined}
              onClick={() => {
                if (d === -1) setAtual(a => (a - 1 + total) % total)
                if (d ===  1) setAtual(a => (a + 1) % total)
              }}
            >
              <Image src={foto} alt="" fill className="object-cover object-center" sizes="200px" />
              {!isCenter && (
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="flex items-center gap-1.5 mt-4">
          {fotos.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setAtual(i)}
              animate={{ width: i === atual ? 18 : 6, opacity: i === atual ? 1 : 0.35 }}
              transition={{ duration: 0.25 }}
              className="h-1.5 rounded-full"
              style={{ background: acento }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Componente principal ── */
export default function ContadorRelacionamento({
  dataInicio, nome1, nome2, tema = 'classico', fotos = [],
}: Props) {
  const { anos, meses, dias, horas, minutos, segundos } = useContador(dataInicio)
  const cores = CORES[tema] ?? CORES.classico
  const temFotos = fotos.length > 0
  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const reduceMotion = useReducedMotion()
  const skipAnimations = isMobile || !!reduceMotion

  // Parallax — desativado no mobile (caro demais por frame de scroll)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bokeh1Y = useTransform(scrollYProgress, [0, 1], skipAnimations ? ['0%', '0%'] : ['0%', '-45%'])
  const bokeh2Y = useTransform(scrollYProgress, [0, 1], skipAnimations ? ['0%', '0%'] : ['0%', '-28%'])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  const partesData = [
    anos > 0 ? `${anos} ${anos === 1 ? 'ano' : 'anos'}` : null,
    meses > 0 ? `${meses} ${meses === 1 ? 'mês' : 'meses'}` : null,
    `${dias} ${dias === 1 ? 'dia' : 'dias'}`,
  ].filter(Boolean).join(' · ')

  const tempo = `${String(horas).padStart(2,'0')}h ${String(minutos).padStart(2,'0')}min ${String(segundos).padStart(2,'0')}s`

  return (
    <div
      ref={heroRef}
      className="relative flex items-center justify-center text-center overflow-hidden"
      style={{ background: HERO_BG[tema] ?? HERO_BG.classico, minHeight: '100svh', paddingTop: 48, paddingBottom: 48 }}
    >
      {/* Bokeh — com parallax no desktop, estático no mobile */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: skipAnimations ? 280 : 380,
          height: skipAnimations ? 280 : 380,
          left: '-8%', top: '-12%',
          background: cores.acento,
          filter: `blur(${skipAnimations ? 90 : 120}px)`,
          opacity: 0.13,
          y: bokeh1Y,
        }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: skipAnimations ? 220 : 300,
          height: skipAnimations ? 220 : 300,
          right: '-5%', bottom: '8%',
          background: cores.acento,
          filter: `blur(${skipAnimations ? 75 : 100}px)`,
          opacity: 0.10,
          y: bokeh2Y,
        }}
      />

      {/* Vinheta */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)' }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 px-6 max-w-xl mx-auto w-full flex flex-col items-center">

        {temFotos && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <FotoCarousel fotos={fotos} acento={cores.acento} skipAnimations={skipAnimations} />
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: temFotos ? 0.4 : 0.2, type: 'spring', stiffness: 70, damping: 18 }}
          className="font-display font-bold tracking-tight mb-6"
          style={{ color: cores.texto, fontSize: 'clamp(2rem, 9vw, 4.4rem)', lineHeight: 1.1 }}
        >
          {nome1}<span style={{ color: cores.acento }}> & </span>{nome2}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: temFotos ? 0.55 : 0.35, duration: 0.7 }}
          className="mb-6"
          style={{ height: 1, width: 64, background: `linear-gradient(to right, transparent, ${cores.acento}, transparent)` }}
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: temFotos ? 0.6 : 0.4 }}
          className="text-xs font-semibold tracking-[0.22em] uppercase mb-3"
          style={{ color: cores.acento }}
        >
          ✦ unidos há ✦
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: temFotos ? 0.65 : 0.45 }}
          className="font-display font-bold mb-3"
          style={{ color: cores.texto, fontSize: 'clamp(1.3rem, 5vw, 2.4rem)' }}
        >
          {partesData}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: temFotos ? 0.75 : 0.6 }}
          className="tabular-nums text-sm sm:text-base tracking-widest"
          style={{ color: cores.label, fontVariantNumeric: 'tabular-nums' }}
        >
          {tempo}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-xs mt-8 tracking-wide"
          style={{ color: cores.label }}
        >
          e contando, segundo a segundo
        </motion.p>
      </div>

      {/* Scroll hint — some quando começa a rolar */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ opacity: scrollHintOpacity }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown
            className="w-6 h-6"
            style={{ color: cores.label }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
