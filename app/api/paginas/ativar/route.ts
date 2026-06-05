import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { enviarEmailConfirmacao } from '@/lib/resend'
import type { Pagina } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { slug } = await req.json()
  if (!slug) return NextResponse.json({ error: 'slug obrigatório' }, { status: 400 })

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

  const { error } = await supabase
    .from('pages')
    .update({ status: 'active', paid_at: new Date().toISOString() })
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
