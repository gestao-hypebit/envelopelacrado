import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { slug, campos } = body

  if (!slug || !campos) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Confirma que a página pertence ao usuário autenticado
  const { data: pagina, error: erroBusca } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .single()

  if (erroBusca || !pagina) {
    return NextResponse.json({ error: 'Página não encontrada ou sem permissão' }, { status: 403 })
  }

  // Campos permitidos para edição
  const permitidos = ['nome_pessoa1', 'nome_pessoa2', 'data_inicio', 'narrativa_ia', 'tema', 'musica_url', 'colaboracao_ativa', 'colaboracao_prazo']
  const camposValidos: Record<string, unknown> = {}
  for (const key of permitidos) {
    if (key in campos) camposValidos[key] = campos[key]
  }
  camposValidos.updated_at = new Date().toISOString()

  const { error: erroUpdate } = await supabase
    .from('pages')
    .update(camposValidos)
    .eq('id', pagina.id)

  if (erroUpdate) {
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
