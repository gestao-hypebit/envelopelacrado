'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CoracoesFlutantes from './CoracoesFlutantes'

interface Props {
  nome1: string
  nome2: string
  tema?: string
  children: React.ReactNode
  autoAbrir?: boolean
}

interface Particula {
  id: number
  x: number
  y: number
  scale: number
  rotate: number
  delay: number
  emoji: string
}

const EMOJIS = ['❤️', '💕', '💗', '💖', '✨', '💫', '🌸', '💝']

export default function AberturaPagina({ nome1, nome2, tema = 'classico', children, autoAbrir = false }: Props) {
  const [fase, setFase] = useState<'fechado' | 'abrindo' | 'aberto'>(autoAbrir ? 'aberto' : 'fechado')
  const [particulas, setParticulas] = useState<Particula[]>([])
  const escuro = tema === 'escuro'

  useEffect(() => {
    setParticulas(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 700,
        y: -(Math.random() * 600 + 80),
        scale: Math.random() * 1.6 + 0.4,
        rotate: Math.random() * 90 - 45,
        delay: Math.random() * 0.6,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      }))
    )
  }, [])

  const handleAbrir = async () => {
    setFase('abrindo')

    // Confetti burst ao abrir
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { x: 0.5, y: 0.55 },
      colors: ['#C9768F', '#F5EDE3', '#E8C8B0', '#ffffff', '#ffb3c8', '#C9A96E'],
      scalar: 1.1,
      disableForReducedMotion: true,
    })
    // Segundo burst levemente depois
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x: 0.3, y: 0.6 },
        colors: ['#C9768F', '#F5EDE3', '#ffffff'],
        scalar: 0.9,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x: 0.7, y: 0.6 },
        colors: ['#C9A96E', '#E8C8B0', '#ffffff'],
        scalar: 0.9,
        disableForReducedMotion: true,
      })
    }, 350)

    setTimeout(() => setFase('aberto'), 2500)
  }

  const bg = escuro ? '#0D0D0D' : '#1a0610'

  // Paleta do envelope — sempre visível sobre o fundo escuro
  const corCorpo    = escuro ? '#2d1f1a' : '#FFF8F2'
  const corAba      = escuro ? '#3d2820' : '#F2E0CC'
  const corAbaBorda = escuro ? '#4d3028' : '#E8CCB0'
  const corSelo     = escuro ? '#C9A96E' : '#C9768F'
  const corTitulo   = escuro ? '#C9A96E' : '#5a3020'
  const corSub      = escuro ? '#8a6040' : '#A0785A'
  const corBorda    = escuro ? '#3d2828' : '#E8C8A8'

  const W = 420
  const H = 270
  // A aba cobre os primeiros 52% do envelope (de cima pra baixo)
  const FLAP_H = H * 0.52

  return (
    <>
      <AnimatePresence>
        {fase !== 'aberto' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden"
            style={{ background: bg }}
            exit={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
          >
            {/* ── FUNDO: Orbs de luz (efeito aurora) ── */}
            {[
              { w: 500, h: 500, x: '10%',  y: '5%',  color: escuro ? '#C9A96E' : '#C9768F', dur: 8  },
              { w: 400, h: 400, x: '60%',  y: '50%', color: escuro ? '#8B4513' : '#e88fa8', dur: 11 },
              { w: 350, h: 350, x: '25%',  y: '65%', color: escuro ? '#C9A96E' : '#f5a0c0', dur: 9  },
              { w: 300, h: 300, x: '75%',  y: '10%', color: escuro ? '#6B3410' : '#d4607a', dur: 13 },
            ].map((orb, i) => (
              <motion.div
                key={`orb-${i}`}
                className="absolute pointer-events-none"
                style={{
                  width: orb.w,
                  height: orb.h,
                  left: orb.x,
                  top: orb.y,
                  background: orb.color,
                  borderRadius: '50%',
                  filter: 'blur(80px)',
                  opacity: 0.18,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  x: [0, 30, -20, 15, 0],
                  y: [0, -25, 20, -10, 0],
                  scale: [1, 1.1, 0.95, 1.05, 1],
                  opacity: [0.18, 0.26, 0.15, 0.22, 0.18],
                }}
                transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

            {/* ── FUNDO: Corações subindo em loop ── */}
            {[...Array(12)].map((_, i) => {
              const emoji = ['❤️', '💕', '💗', '✨', '💖'][i % 5]
              const left = 5 + (i * 8.5) % 90
              const size = 0.8 + (i % 3) * 0.4
              const dur = 6 + (i % 5) * 2
              const delay = -(i * 1.3)
              return (
                <motion.div
                  key={`float-${i}`}
                  className="absolute pointer-events-none select-none"
                  style={{ left: `${left}%`, bottom: '-5%', fontSize: `${size}rem`, opacity: 0 }}
                  animate={{
                    y: [0, -1200],
                    opacity: [0, 0.5, 0.5, 0],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 3)],
                  }}
                  transition={{
                    duration: dur,
                    delay,
                    repeat: Infinity,
                    ease: 'easeOut',
                    times: [0, 0.1, 0.8, 1],
                  }}
                >
                  {emoji}
                </motion.div>
              )
            })}

            {/* ── FUNDO: Estrelas/faíscas ── */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute pointer-events-none select-none"
                style={{
                  left: `${(i * 17 + 3) % 95}%`,
                  top: `${(i * 23 + 7) % 90}%`,
                  width: 3 + (i % 3),
                  height: 3 + (i % 3),
                  borderRadius: '50%',
                  background: escuro ? '#C9A96E' : '#fff',
                  boxShadow: escuro ? '0 0 6px #C9A96E' : '0 0 6px #ffb3c8',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 2 + (i % 4),
                  delay: -(i * 0.4),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Overlay escuro sutil no centro pra o envelope se destacar */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)',
              }}
            />

            {/* Partículas ao abrir */}
            {fase === 'abrindo' && particulas.map((p) => (
              <motion.div
                key={p.id}
                className="absolute left-1/2 top-1/2 pointer-events-none select-none"
                style={{ fontSize: `${p.scale * 1.6}rem`, zIndex: 60 }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: p.x, y: p.y,
                  opacity: [0, 1, 1, 0],
                  scale: [0, p.scale, p.scale * 0.8, 0],
                  rotate: p.rotate,
                }}
                transition={{ duration: 2, delay: p.delay, ease: 'easeOut' }}
              />
            ))}

            {/* Perspectiva + envelope */}
            <motion.div
              style={{ perspective: 1000 }}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Envelope inteiro some ao abrir */}
              <motion.div
                animate={fase === 'abrindo'
                  ? { opacity: [1, 1, 0], scale: [1, 1.04, 0.2], y: [0, -8, 60] }
                  : {}}
                transition={{ duration: 2, ease: 'easeInOut', times: [0, 0.6, 1] }}
                style={{ position: 'relative', width: W }}
              >

                {/* ─── CORPO DO ENVELOPE (parte de baixo visível) ─── */}
                <div
                  style={{
                    width: W,
                    height: H,
                    background: corCorpo,
                    borderRadius: 8,
                    border: `1px solid ${corBorda}`,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: escuro
                      ? '0 24px 60px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.4)'
                      : '0 24px 60px rgba(140,80,40,0.2), 0 4px 16px rgba(140,80,40,0.08)',
                  }}
                >
                  {/* Linhas diagonais de dobra (decorativas, sutis) */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.18,
                    background: `linear-gradient(to bottom right, transparent 49.6%, ${corAbaBorda} 49.6%, ${corAbaBorda} 50.4%, transparent 50.4%)`,
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.18,
                    background: `linear-gradient(to bottom left, transparent 49.6%, ${corAbaBorda} 49.6%, ${corAbaBorda} 50.4%, transparent 50.4%)`,
                  }} />

                  {/* ── ÁREA DE ENDEREÇO ── */}
                  {/* Começa 30px abaixo do lacre (que fica em FLAP_H - 26 + raio 27 = FLAP_H + 1) */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: FLAP_H + 32, // bem abaixo do lacre
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 16,
                    gap: 4,
                  }}>
                    <h1 style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: nome1.length > 12 ? '1.7rem' : '2.1rem',
                      fontWeight: 700,
                      color: corTitulo,
                      lineHeight: 1.1,
                      textAlign: 'center',
                      margin: 0,
                    }}>
                      {nome1}
                    </h1>
                    <p style={{ fontSize: 12, color: corSub, margin: 0 }}>
                      de <span style={{ color: corSelo, fontWeight: 600 }}>{nome2}</span>
                    </p>
                  </div>
                </div>

                {/* ─── ABA SUPERIOR (triângulo que abre) ─── */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: W,
                    height: FLAP_H,
                    transformOrigin: 'top center',
                    zIndex: 10,
                    // Sem overflow:hidden aqui pra o lacre aparecer na frente
                  }}
                  animate={fase === 'abrindo' ? { rotateX: -178 } : { rotateX: 0 }}
                  transition={{ duration: 0.95, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Forma triangular da aba */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(170deg, ${corAba} 0%, ${corAbaBorda} 100%)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    borderRadius: '8px 8px 0 0',
                  }} />

                  {/* Lacre de cera — na ponta inferior da aba (centro do envelope) */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: -26,
                      left: 'calc(50% - 27px)',
                      width: 54,
                      height: 54,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 38% 35%, ${corSelo}ee, ${corSelo}99)`,
                      boxShadow: `0 3px 14px ${corSelo}55, inset 0 1px 3px rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.15)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 20,
                      border: `2px solid ${corSelo}bb`,
                    }}
                    animate={fase === 'fechado' ? { scale: [1, 1.06, 1], rotate: [0, 3, 0, -3, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
                      💌
                    </span>
                  </motion.div>
                </motion.div>

                {/* Botão abaixo do envelope */}
                <AnimatePresence>
                  {fase === 'fechado' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.06, boxShadow: `0 8px 28px ${corSelo}50` }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleAbrir}
                        style={{
                          padding: '12px 32px',
                          borderRadius: 50,
                          border: 'none',
                          background: `linear-gradient(135deg, ${corSelo}, ${escuro ? '#a07830' : '#b5607a'})`,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: 'pointer',
                          letterSpacing: 0.5,
                          boxShadow: `0 4px 20px ${corSelo}40`,
                        }}
                      >
                        Abrir minha surpresa 💌
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo da página */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fase === 'aberto' ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>

      {/* Corações — fora da motion.div para position:fixed funcionar corretamente */}
      {fase === 'aberto' && <CoracoesFlutantes />}
    </>
  )
}
