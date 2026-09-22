import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { enviarEmailConfirmacao } from '@/lib/resend'
import { buscarPagamento } from '@/lib/mercadopago'
import type { Pagina } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { slug, paymentId } = await req.json()
  if (!slug) return NextResponse.json({ error: 'slug obrigatório' }, { status: 400 })
  if (!paymentId) return NextResponse.json({ error: 'paymentId obrigatório' }, { status: 400 })

  // Busca a página antes de ativar para verificar se já foi processada
  const { data: paginaAtual } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!paginaAtual) {
    return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 })
  }

  // Já ativa e email já enviado (paid_at preenchido) — idempotente
  if (paginaAtual.status === 'active' && paginaAtual.paid_at) {
    return NextResponse.json({ ok: true })
  }

  // Confirma no Mercado Pago que ESSE pagamento foi aprovado e pertence a ESSA página
  // antes de ativar — nunca confiar no que o client alega.
  let payment
  try {
    payment = await buscarPagamento(String(paymentId))
  } catch {
    return NextResponse.json({ error: 'Não foi possível confirmar o pagamento' }, { status: 502 })
  }

  if (payment.status !== 'approved') {
    return NextResponse.json({ error: 'Pagamento ainda não aprovado' }, { status: 402 })
  }

  if (String(payment.external_reference) !== String(paginaAtual.id)) {
    return NextResponse.json({ error: 'Pagamento não corresponde a esta página' }, { status: 403 })
  }

  const { error } = await supabase
    .from('pages')
    .update({ status: 'active', payment_id: String(paymentId), paid_at: new Date().toISOString() })
    .eq('slug', slug)

  if (error) {
    console.error('[paginas/ativar]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Envia email de confirmação com QR Code
  const { data: paginaAtualizada } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (paginaAtualizada?.email_criador) {
    enviarEmailConfirmacao(paginaAtualizada as Pagina).catch((err) =>
      console.error('[paginas/ativar] email:', err?.message)
    )
  }

  return NextResponse.json({ ok: true })
}
