import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const { data: paginas, error } = await supabase
    .from('pages')
    .select('id, slug, nome_pessoa1, nome_pessoa2, data_inicio, status, tema, created_at')
    .eq('email_criador', email.toLowerCase().trim())
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Erro ao buscar páginas' }, { status: 500 })
  }

  return NextResponse.json({ paginas: paginas ?? [] })
}
