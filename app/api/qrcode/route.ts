import { NextRequest } from 'next/server'
import { gerarQRCodeBuffer } from '@/lib/qrcode'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  const pageId = searchParams.get('pageId')

  if (!url) {
    return new Response('URL é obrigatória', { status: 400 })
  }

  // Se informar pageId, verificar se a página está ativa
  if (pageId) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('pages')
      .select('status')
      .eq('id', pageId)
      .single()

    if (!data || data.status !== 'active') {
      return new Response('Página não está ativa', { status: 403 })
    }
  }

  try {
    const buffer = await gerarQRCodeBuffer(url)
    const uint8Array = new Uint8Array(buffer)

    return new Response(uint8Array, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('[qrcode] Erro:', error)
    return new Response('Erro ao gerar QR Code', { status: 500 })
  }
}
