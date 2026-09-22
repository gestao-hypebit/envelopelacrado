import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// iOS aplica o arredondamento sozinho — fundo precisa ser quadrado e sem transparência
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #C9768F, #b5607a)',
          color: '#FAFAF8',
          fontSize: 120,
          lineHeight: 1,
        }}
      >
        ♥
      </div>
    ),
    size
  )
}
