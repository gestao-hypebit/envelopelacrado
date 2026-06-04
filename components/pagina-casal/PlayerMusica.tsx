'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Music } from 'lucide-react'
import Image from 'next/image'

interface PlayerMusicaProps {
  musicaUrl: string
  tema?: string
}

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : ''
}

export default function PlayerMusica({ musicaUrl, tema = 'classico' }: PlayerMusicaProps) {
  const [tocando, setTocando] = useState(false)
  const escuro = tema === 'escuro'
  const corAcento = escuro ? '#C9A96E' : '#C9768F'

  const isYouTube = musicaUrl.includes('youtube') || musicaUrl.includes('youtu.be')
  const ytId = isYouTube ? extractYouTubeId(musicaUrl) : ''
  const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : ''

  return (
    <section className="py-10 sm:py-16 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: corAcento }}
          >
            ♫ nossa música
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: escuro
              ? 'linear-gradient(145deg, #1a1a1a, #111)'
              : 'linear-gradient(145deg, #fff, #fdf8f5)',
            border: escuro ? '1px solid #2a2a2a' : '1px solid #f0e6dd',
          }}
        >
          {isYouTube && !tocando ? (
            /* Capa com botão de play */
            <div className="relative group cursor-pointer" onClick={() => setTocando(true)}>
              <div className="relative w-full aspect-video bg-gray-900">
                {thumbUrl && (
                  <Image
                    src={thumbUrl}
                    alt="Capa da música"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                {/* Overlay escuro */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-70"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                />
                {/* Botão play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                    style={{ background: corAcento }}
                  >
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </motion.div>
                </div>
              </div>

              {/* Info da música */}
              <div className="p-5 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${corAcento}20` }}
                >
                  <Music className="w-5 h-5" style={{ color: corAcento }} />
                </div>
                <div className="flex-1">
                  <p
                    className="font-display font-semibold text-base"
                    style={{ color: escuro ? '#E8D5B7' : '#1a1a1a' }}
                  >
                    Nossa música especial
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: escuro ? '#666' : '#aaa' }}>
                    Toque para ouvir ♪
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: corAcento }}
                >
                  <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                </div>
              </div>
            </div>
          ) : isYouTube && tocando ? (
            /* Player embed */
            <div>
              <div className="relative w-full aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                  title="Nossa música"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 border-0"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-xs" style={{ color: escuro ? '#666' : '#bbb' }}>
                  ♪ tocando nossa música ♪
                </p>
              </div>
            </div>
          ) : (
            /* Link genérico */
            <div className="p-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${corAcento}20` }}
              >
                <Music className="w-8 h-8" style={{ color: corAcento }} />
              </div>
              <a
                href={musicaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline transition-colors"
                style={{ color: corAcento }}
              >
                Ouvir nossa música ♫
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
