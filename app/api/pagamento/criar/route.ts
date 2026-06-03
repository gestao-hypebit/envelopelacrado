import { NextRequest, NextResponse } from 'next/server'
import { criarPreferencia } from '@/lib/mercadopago'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pageId, slug } = body

    if (!pageId || !slug) {
      return NextResponse.json(
        { error: 'pageId e slug são obrigatórios' },
        { status: 400 }
      )
    }

    const preferencia = await criarPreferencia(pageId, slug)

    return NextResponse.json({
      preferenceId: preferencia.id,
      initPoint: preferencia.init_point,
    })
  } catch (error: any) {
    console.error('[pagamento/criar] Erro completo:', JSON.stringify(error?.cause ?? error, null, 2))
    return NextResponse.json(
      { error: error?.cause?.message ?? error?.message ?? 'Erro ao criar preferência de pagamento' },
      { status: 500 }
    )
  }
}
