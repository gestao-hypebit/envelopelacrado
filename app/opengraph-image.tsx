import { ImageResponse } from 'next/og'
import { SITE_TAGLINE } from '@/lib/seo'

export const alt = 'Envelope Lacrado — presente digital para namorados, narrado pela IA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Imagem de compartilhamento padrão do site (WhatsApp, Instagram, Google, X)
export default function OpengraphImage() {
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
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 900,
            height: 560,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,118,143,0.22) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div style={{ fontSize: 18, color: '#C9768F', letterSpacing: '0.25em', marginBottom: 28, display: 'flex' }}>
          ENVELOPE LACRADO
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#F0E4D4',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 1000,
            display: 'flex',
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div style={{ fontSize: 30, color: '#C9768F', marginTop: 24, marginBottom: 16, display: 'flex' }}>♥</div>
        <div style={{ fontSize: 26, color: 'rgba(240,228,212,0.6)', textAlign: 'center', display: 'flex' }}>
          Presente digital com fotos, contador e QR Code · R$ 19,90
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 16,
            color: 'rgba(240,228,212,0.3)',
            letterSpacing: '0.08em',
            display: 'flex',
          }}
        >
          envelopelacrado.com.br
        </div>
      </div>
    ),
    size
  )
}
