import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { enviarEmailConfirmacao } from '@/lib/resend'
import type { Pagina } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { token, pageId } = await req.json()

    if (!token || !pageId) {
      return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 })
    }

    // Valida contra o código de admin definido no .env
    const adminCode = process.env.ADMIN_COUPON_CODE
    if (!adminCode || token !== adminCode) {
      return NextResponse.json({ error: 'Código de convite inválido' }, { status: 400 })
    }

    // Busca a página
    const { data: pagina } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (!pagina) {
      return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 })
    }

    if (pagina.status === 'active') {
      return NextResponse.json({ ok: true })
    }

    // Ativa a página gratuitamente
    const { error } = await supabase
      .from('pages')
      .update({
        status: 'active',
        payment_id: `admin-coupon`,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    if (error) {
      console.error('[referral/usar]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Envia email de confirmação
    const { data: paginaAtivada } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (paginaAtivada?.email_criador) {
      enviarEmailConfirmacao(paginaAtivada as Pagina).catch((err) =>
        console.error('[referral/usar] email:', err?.message)
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[referral/usar]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
