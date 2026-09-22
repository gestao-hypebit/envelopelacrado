import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Parâmetro slug ausente' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data: pagina, error } = await supabase
    .from('pages')
    .select('id, slug, nome_pessoa1, nome_pessoa2, data_inicio, narrativa_ia, tema, musica_url, colaboracao_ativa, colaboracao_prazo')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .single()

  if (error || !pagina) {
    return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ pagina })
}
