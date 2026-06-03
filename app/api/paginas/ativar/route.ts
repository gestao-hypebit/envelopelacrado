import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { slug } = await req.json()
  if (!slug) return NextResponse.json({ error: 'slug obrigatório' }, { status: 400 })

  const { error } = await supabase
    .from('pages')
    .update({ status: 'active', paid_at: new Date().toISOString() })
    .eq('slug', slug)
    .eq('status', 'draft')

  if (error) {
    console.error('[paginas/ativar]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
