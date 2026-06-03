import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const email = req.nextUrl.searchParams.get('email')

  if (!slug || !email) {
    return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes' }, { status: 400 })
  }

  const { data: pagina, error } = await supabase
    .from('pages')
    .select('id, slug, nome_pessoa1, nome_pessoa2, data_inicio, narrativa_ia, tema, musica_url, colaboracao_ativa, colaboracao_prazo')
    .eq('slug', slug)
    .eq('email_criador', email.toLowerCase().trim())
    .eq('status', 'active')
    .single()

  if (error || !pagina) {
    return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ pagina })
}
