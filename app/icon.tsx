import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

// Favicon gerado em build: selo rosa com coração
export default function Icon() {
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
          borderRadius: '22%',
          color: '#FAFAF8',
          fontSize: 340,
          lineHeight: 1,
        }}
      >
        ♥
      </div>
    ),
    size
  )
}
