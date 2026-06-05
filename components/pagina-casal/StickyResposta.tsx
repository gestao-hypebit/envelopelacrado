'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface Props {
  acento: string
}

export default function StickyResposta({ acento }: Props) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const checar = () => {
      const scrollY = window.scrollY
      if (scrollY < 400) { setVisivel(false); return }

      const msgboard = document.getElementById('messageboard')
      if (!msgboard) { setVisivel(true); return }

      const rect = msgboard.getBoundingClientRect()
      // Esconde quando a seção de resposta já está visível na tela
      setVisivel(rect.top > window.innerHeight * 0.55)
    }

    window.addEventListener('scroll', checar, { passive: true })
    checar()
    return () => window.removeEventListener('scroll', checar)
  }, [])

  const handleClick = () => {
    const el = document.getElementById('messageboard')
    el?.scrollIntoView({ behavior: 'smooth' })
    // Abre o formulário após o scroll chegar
    setTimeout(() => document.dispatchEvent(new CustomEvent('open-reply')), 700)
  }

  return (
    <AnimatePresence>
      {visivel && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          onClick={handleClick}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-semibold whitespace-nowrap select-none"
          style={{
            background: `linear-gradient(135deg, ${acento}, ${acento}bb)`,
            boxShadow: `0 6px 28px ${acento}50`,
          }}
        >
          <Heart className="w-4 h-4 fill-white flex-shrink-0" />
          Deixar minha resposta
        </motion.button>
      )}
    </AnimatePresence>
  )
}
