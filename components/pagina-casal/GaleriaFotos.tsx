'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Momento } from '@/types'

interface GaleriaFotosProps {
  momentos: Momento[]
  tema?: string
}

export default function GaleriaFotos({ momentos, tema = 'classico' }: GaleriaFotosProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const escuro = tema === 'escuro'
  const fotos = momentos.filter((m) => m.foto_url)

  if (fotos.length === 0) return null

  const anterior = () => setLightbox((i) => (i === null ? null : (i - 1 + fotos.length) % fotos.length))
  const proximo = () => setLightbox((i) => (i === null ? null : (i + 1) % fotos.length))

  // Alturas variadas para efeito mosaico
  const alturas = ['aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]']

  return (
    <section className="py-10 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-medium tracking-widest uppercase" style={{ color: '#C9768F' }}>
            Em imagens
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: escuro ? '#C9A96E' : '#1a1a1a' }}
          >
            Nossa galeria
          </h2>
        </motion.div>

        {/* Mosaico */}
        <div className="columns-2 sm:columns-3 gap-3 space-y-3">
          {fotos.map((momento, index) => (
            <motion.div
              key={momento.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="relative break-inside-avoid cursor-pointer group overflow-hidden rounded-2xl"
              onClick={() => setLightbox(index)}
            >
              <div className={`relative w-full ${alturas[index % alturas.length]}`}>
                <Image
                  src={momento.foto_url!}
                  alt={momento.titulo}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-sm font-medium">{momento.titulo}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightbox(null)}
          >
            {/* Fechar */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Anterior */}
            {fotos.length > 1 && (
              <button
                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                onClick={(e) => { e.stopPropagation(); anterior() }}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Foto */}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-3xl max-h-[80vh] w-full mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh]">
                <Image
                  src={fotos[lightbox].foto_url!}
                  alt={fotos[lightbox].titulo}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center mt-3">
                <p className="text-white font-medium">{fotos[lightbox].titulo}</p>
                {fotos[lightbox].descricao && (
                  <p className="text-white/60 text-sm mt-1">{fotos[lightbox].descricao}</p>
                )}
                <p className="text-white/40 text-xs mt-2">{lightbox + 1} / {fotos.length}</p>
              </div>
            </motion.div>

            {/* Próximo */}
            {fotos.length > 1 && (
              <button
                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                onClick={(e) => { e.stopPropagation(); proximo() }}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
