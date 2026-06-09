import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const nome1 = searchParams.get('nome1') ?? 'Ana'
  const nome2 = searchParams.get('nome2') ?? 'João'

  const nomesLongos = nome1.length + nome2.length > 22
  const fontSize = nomesLongos ? 60 : 76

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d0612',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,118,143,0.18) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Brand label */}
        <div
          style={{
            fontSize: 16,
            color: '#C9768F',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 28,
            opacity: 0.85,
            display: 'flex',
          }}
        >
          ENVELOPE LACRADO
        </div>

        {/* Thin horizontal line */}
        <div
          style={{
            width: 40,
            height: 1,
            background: 'rgba(201,118,143,0.4)',
            marginBottom: 28,
            display: 'flex',
          }}
        />

        {/* Names */}
        <div
          style={{
            fontSize,
            fontWeight: 700,
            color: '#F0E4D4',
            letterSpacing: '-1px',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 1000,
            display: 'flex',
          }}
        >
          {nome1} &amp; {nome2}
        </div>

        {/* Heart */}
        <div
          style={{
            fontSize: 28,
            color: '#C9768F',
            marginTop: 24,
            marginBottom: 12,
            display: 'flex',
          }}
        >
          ♥
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: 'rgba(240,228,212,0.5)',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          A história de vocês, narrada pela IA
        </div>

        {/* Bottom domain hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 13,
            color: 'rgba(240,228,212,0.2)',
            letterSpacing: '0.08em',
            display: 'flex',
          }}
        >
          envelopelacrado.com.br
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
