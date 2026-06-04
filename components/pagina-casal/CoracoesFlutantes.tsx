'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Coracao {
  id: number
  x: number       // % da tela
  size: number    // px
  dur: number     // segundos
  drift: number   // deslocamento lateral px
  emoji: string
  opacity: number
}

const EMOJIS = ['❤️', '💕', '💗', '💖', '🩷', '💝']
let uid = 0

export default function CoracoesFlutantes() {
  const [coracoes, setCoracoes] = useState<Coracao[]>([])

  const spawn = useCallback(() => {
    setCoracoes(prev => {
      if (prev.length >= 12) return prev
      return [
        ...prev,
        {
          id: uid++,
          x: 4 + Math.random() * 92,
          size: 14 + Math.random() * 14,
          dur: 8 + Math.random() * 6,
          drift: (Math.random() - 0.5) * 70,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          opacity: 0.28 + Math.random() * 0.38,
        },
      ]
    })
  }, [])

  const remove = useCallback((id: number) => {
    setCoracoes(prev => prev.filter(c => c.id !== id))
  }, [])

  useEffect(() => {
    // Primeiros corações com pequeno delay escalonado
    const iniciais = [0, 600, 1400, 2400].map(d =>
      setTimeout(spawn, d)
    )
    const intervalo = setInterval(spawn, 2000)
    return () => {
      iniciais.forEach(clearTimeout)
      clearInterval(intervalo)
    }
  }, [spawn])

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {coracoes.map(c => (
        <motion.span
          key={c.id}
          className="absolute select-none leading-none"
          style={{
            left: `${c.x}%`,
            bottom: '-4%',
            fontSize: c.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -120, -320, -580, -900],
            x: [0, c.drift * 0.3, c.drift * -0.4, c.drift * 0.6, c.drift * -0.2],
            opacity: [0, c.opacity, c.opacity, c.opacity * 0.5, 0],
            scale: [0.4, 1, 0.95, 0.8, 0.55],
          }}
          transition={{
            duration: c.dur,
            ease: 'easeOut',
            times: [0, 0.12, 0.45, 0.75, 1],
          }}
          onAnimationComplete={() => remove(c.id)}
        >
          {c.emoji}
        </motion.span>
      ))}
    </div>
  )
}
