import { NextRequest, NextResponse } from 'next/server'
import { buscarPagamento } from '@/lib/mercadopago'
import { createServiceClient } from '@/lib/supabase/server'
import { enviarEmailConfirmacao } from '@/lib/resend'
import type { Pagina } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const paymentId = String(body.data?.id)
    if (!paymentId) {
      return NextResponse.json({ ok: true })
    }

    const payment = await buscarPagamento(paymentId)

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const pageId = payment.external_reference
    if (!pageId) {
      return NextResponse.json({ ok: true })
    }

    const supabase = await createServiceClient()

    // Idempotência: verificar se já foi processado
    const { data: paginaExistente } = await supabase
      .from('pages')
      .select('status, payment_id')
      .eq('id', pageId)
      .single()

    if (paginaExistente?.payment_id) {
      return NextResponse.json({ ok: true })
    }

    // Ativar a página
    await supabase
      .from('pages')
      .update({
        status: 'active',
        payment_id: paymentId,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    // Buscar dados para enviar email
    const { data: pagina } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (pagina) {
      await enviarEmailConfirmacao(pagina as Pagina)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[pagamento/webhook] Erro:', error instanceof Error ? error.message : 'Erro desconhecido')
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
