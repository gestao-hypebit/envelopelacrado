'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Copy, CheckCheck, ArrowRight } from 'lucide-react'

interface Props {
  referralToken: string
  tema: string
  bg: string
  acento: string
  texto: string
}

export default function ViralidadeSection({ referralToken, bg, acento, texto }: Props) {
  const [copiado, setCopiado] = useState(false)

  const baseUrl = (process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br').replace(/\/$/, '')
  const link = `${baseUrl}/criar?ref=${referralToken}`

  const handleCriar = () => {
    window.location.href = link
  }

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    } catch {
      // fallback silencioso
    }
  }

  return (
    <section className="py-14 px-4" style={{ background: bg }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center"
      >
        {/* Ícone */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: `${acento}22` }}
        >
          <Heart className="w-7 h-7 fill-current" style={{ color: acento }} />
        </motion.div>

        {/* Título */}
        <h2
          className="font-display text-3xl sm:text-4xl font-bold mb-3 leading-tight"
          style={{ color: texto }}
        >
          Quer criar uma surpresa<br />como essa?
        </h2>

        <p
          className="text-base sm:text-lg mb-8 leading-relaxed"
          style={{ color: `${texto}99` }}
        >
          Quem recebeu merece dar também.{' '}
          <span style={{ color: acento, fontWeight: 600 }}>Crie gratuitamente</span>{' '}
          para o seu amor — presente de quem criou esta página.
        </p>

        {/* CTA principal */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleCriar}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg text-white mb-3 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${acento}, ${acento}cc)`,
            boxShadow: `0 6px 28px ${acento}44`,
          }}
        >
          <Heart className="w-5 h-5 fill-white flex-shrink-0" />
          Criar minha página — de graça
          <ArrowRight className="w-5 h-5 flex-shrink-0" />
        </motion.button>

        {/* Copiar link */}
        <button
          onClick={handleCopiar}
          className="flex items-center justify-center gap-2 mx-auto text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: `${texto}66` }}
        >
          {copiado
            ? <><CheckCheck className="w-4 h-4" style={{ color: acento }} /> Link copiado!</>
            : <><Copy className="w-4 h-4" /> Copiar link para compartilhar</>
          }
        </button>
      </motion.div>
    </section>
  )
}
