'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Texto completo — exibido no card de resultado
const SUGESTOES = [
  'Jantar especial',
  'Cinema',
  'Passeio no parque',
  'Cozinhar juntos',
  'Maratona de série',
  'Museu ou exposição',
  'Piquenique',
  'Noite de jogos',
  'Café na cama',
  'Explorar um bairro',
  'Karaokê',
  'Spa caseiro',
]

// Texto curto — exibido dentro da roda (máx ~11 chars)
const SUGESTOES_RODA = [
  'Jantar',
  'Cinema',
  'Parque',
  'Cozinhar',
  'Maratona',
  'Museu',
  'Piquenique',
  'Noite jogos',
  'Café cama',
  'Bairro novo',
  'Karaokê',
  'Spa caseiro',
]

// [cor de fundo, cor do texto] para cada fatia alternada
const TEMA_CONFIG: Record<string, {
  section: string
  titulo: string
  subtitulo: string
  btn: string
  btnText: string
  resultBg: string
  resultText: string
  resultBorder: string
  // pares [bg, textColor] alternados entre fatias
  fatias: [string, string][]
  ponteiro: string
}> = {
  classico: {
    section: '#130818',
    titulo: '#F0E4D4',
    subtitulo: 'rgba(240,228,212,0.45)',
    btn: '#C9768F',
    btnText: '#fff',
    resultBg: 'rgba(201,118,143,0.13)',
    resultBorder: 'rgba(201,118,143,0.28)',
    resultText: '#F0E4D4',
    fatias: [
      ['#C9768F', '#fff'],
      ['#F5EDE3', '#8a3a50'],
      ['#e8b4c0', '#5a1a30'],
      ['#F0D9D0', '#8a3a50'],
      ['#d4a0b0', '#fff'],
      ['#fceee8', '#8a3a50'],
    ],
    ponteiro: '#C9768F',
  },
  escuro: {
    section: '#0D0D0D',
    titulo: '#E8D5B7',
    subtitulo: '#666',
    btn: '#C9A96E',
    btnText: '#0D0D0D',
    resultBg: '#1a1a1a',
    resultBorder: '#333',
    resultText: '#C9A96E',
    fatias: [
      ['#C9A96E', '#0D0D0D'],
      ['#2a2a2a', '#C9A96E'],
      ['#a08050', '#0D0D0D'],
      ['#1a1a1a', '#C9A96E'],
      ['#8a6a40', '#fff'],
      ['#333', '#C9A96E'],
    ],
    ponteiro: '#C9A96E',
  },
  pastel: {
    section: '#0f0820',
    titulo: '#E8E0F0',
    subtitulo: 'rgba(232,224,240,0.45)',
    btn: '#9b6fbd',
    btnText: '#fff',
    resultBg: 'rgba(155,111,189,0.15)',
    resultBorder: 'rgba(155,111,189,0.3)',
    resultText: '#E8E0F0',
    fatias: [
      ['#9b6fbd', '#fff'],
      ['#E8E0F0', '#3d2d5c'],
      ['#b08ad4', '#fff'],
      ['#d4c8e8', '#3d2d5c'],
      ['#c9a8e8', '#3d2d5c'],
      ['#ede4f8', '#3d2d5c'],
    ],
    ponteiro: '#9b6fbd',
  },
  floral: {
    section: '#0a1408',
    titulo: '#E0F0DE',
    subtitulo: 'rgba(224,240,222,0.45)',
    btn: '#7a9e78',
    btnText: '#fff',
    resultBg: 'rgba(122,158,120,0.15)',
    resultBorder: 'rgba(122,158,120,0.3)',
    resultText: '#E0F0DE',
    fatias: [
      ['#7a9e78', '#fff'],
      ['#F0F7EF', '#2d3d2a'],
      ['#5a8a56', '#fff'],
      ['#d4e8d0', '#2d3d2a'],
      ['#a8c4a6', '#2d3d2a'],
      ['#e0f0de', '#2d3d2a'],
    ],
    ponteiro: '#7a9e78',
  },
}

interface Props {
  tema: string
}

export default function RoletaDestinos({ tema }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [girando, setGirando] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)
  const angleRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const c = TEMA_CONFIG[tema] ?? TEMA_CONFIG.classico
  const n = SUGESTOES.length
  const slice = (2 * Math.PI) / n

  const desenhar = (angle: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = cx - 4

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // sombra da roda
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 16
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.restore()

    for (let i = 0; i < n; i++) {
      const start = angle + i * slice
      const end = start + slice
      const [bgColor, textColor] = c.fatias[i % c.fatias.length]

      // fatia
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = bgColor
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // texto
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + slice / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = textColor
      ctx.font = `bold 12px Inter, sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.shadowBlur = 2
      ctx.fillText(SUGESTOES_RODA[i], r - 14, 4.5)
      ctx.restore()
    }

    // círculo central
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI)
    ctx.fillStyle = c.btn
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2.5
    ctx.stroke()
  }

  useEffect(() => {
    desenhar(angleRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tema])

  const girar = () => {
    if (girando) return
    setGirando(true)
    setResultado(null)

    const extra = 5 * 2 * Math.PI + Math.random() * 2 * Math.PI
    const startAngle = angleRef.current
    const endAngle = startAngle + extra

    // índice vencedor: fatia embaixo do ponteiro (topo = -π/2)
    // ponteiro aponta para cima (-π/2), ajustar para a fatia certa
    const normalizado = ((2 * Math.PI - ((endAngle + Math.PI / 2) % (2 * Math.PI))) % (2 * Math.PI))
    const indiceVencedor = Math.floor(normalizado / slice) % n

    const duracao = 3500
    const inicio = performance.now()

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const animar = (agora: number) => {
      const elapsed = agora - inicio
      const t = Math.min(elapsed / duracao, 1)
      const easedT = easeOut(t)
      const anguloAtual = startAngle + (endAngle - startAngle) * easedT

      angleRef.current = anguloAtual
      desenhar(anguloAtual)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animar)
      } else {
        angleRef.current = endAngle
        desenhar(endAngle)
        setResultado(SUGESTOES[indiceVencedor])
        setGirando(false)
      }
    }

    rafRef.current = requestAnimationFrame(animar)
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section className="py-14 px-4" style={{ background: c.section }}>
      <div className="max-w-md mx-auto text-center space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1" style={{ color: c.titulo }}>
            Para onde vamos hoje?
          </h2>
          <p className="text-sm" style={{ color: c.subtitulo }}>
            Deixa o acaso decidir o próximo programa de vocês.
          </p>
        </div>

        {/* Roleta */}
        <div className="relative flex justify-center items-start">
          {/* Ponteiro */}
          <div
            className="absolute z-10"
            style={{
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '13px solid transparent',
              borderRight: '13px solid transparent',
              borderTop: `28px solid ${c.ponteiro}`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
            }}
          />
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="rounded-full"
            style={{ display: 'block' }}
          />
        </div>

        {/* Resultado */}
        <AnimatePresence mode="wait">
          {resultado && !girando && (
            <motion.div
              key={resultado}
              initial={{ scale: 0.8, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="rounded-2xl px-6 py-4"
              style={{ background: c.resultBg, border: `1px solid ${c.resultBorder}` }}
            >
              <p className="font-display text-lg font-bold" style={{ color: c.resultText }}>
                {resultado}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão */}
        <motion.button
          onClick={girar}
          disabled={girando}
          whileTap={{ scale: girando ? 1 : 0.95 }}
          className="px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-opacity disabled:opacity-60"
          style={{ background: c.btn, color: c.btnText }}
        >
          {girando ? 'Girando...' : resultado ? 'Girar novamente' : 'Girar!'}
        </motion.button>
      </div>
    </section>
  )
}
