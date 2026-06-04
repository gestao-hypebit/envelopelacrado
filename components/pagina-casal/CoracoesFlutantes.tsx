'use client'

import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

interface Coracao {
  id: number
  x: number       // % da tela
  size: number    // px
  dur: number     // s
  drift: number   // px lateral
  emoji: string
  opacity: number
}

const EMOJIS = ['❤️', '💕', '💗', '💖', '🩷', '💝']
let uid = 0

export default function CoracoesFlutantes() {
  const [coracoes, setCoracoes] = useState<Coracao[]>([])
  const isMobile = useIsMobile()

  // Mobile: máx 4 corações, intervalo 5s | Desktop: máx 9, intervalo 2.8s
  const MAX = isMobile ? 4 : 9
  const INTERVAL = isMobile ? 5000 : 2800

  useEffect(() => {
    const spawn = () => {
      setCoracoes(prev => {
        if (prev.length >= MAX) return prev
        return [
          ...prev,
          {
            id: uid++,
            x: 4 + Math.random() * 92,
            size: isMobile ? 12 + Math.random() * 8 : 14 + Math.random() * 13,
            dur: 9 + Math.random() * 5,
            drift: (Math.random() - 0.5) * (isMobile ? 50 : 80),
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            opacity: isMobile ? 0.22 + Math.random() * 0.22 : 0.28 + Math.random() * 0.32,
          },
        ]
      })
    }

    const iniciais = isMobile
      ? [setTimeout(spawn, 0), setTimeout(spawn, 1800)]
      : [setTimeout(spawn, 0), setTimeout(spawn, 900), setTimeout(spawn, 2000)]
    const intervalo = setInterval(spawn, INTERVAL)

    return () => {
      iniciais.forEach(clearTimeout)
      clearInterval(intervalo)
    }
  }, [isMobile, MAX, INTERVAL])

  const remove = (id: number) =>
    setCoracoes(prev => prev.filter(c => c.id !== id))

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {coracoes.map(c => (
        <span
          key={c.id}
          onAnimationEnd={() => remove(c.id)}
          style={
            {
              position: 'absolute',
              left: `${c.x}%`,
              bottom: '-5%',
              fontSize: c.size,
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              animation: `floatCoracao ${c.dur}s ease-out forwards`,
              '--drift': `${c.drift}px`,
              '--op': c.opacity,
            } as React.CSSProperties
          }
        >
          {c.emoji}
        </span>
      ))}
    </div>
  )
}
