import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { slug, email, campos } = body

  if (!slug || !email || !campos) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  // Verifica que o email é dono desta página
  const { data: pagina, error: erroBusca } = await supabase
    .from('pages')
    .select('id, status')
    .eq('slug', slug)
    .eq('email_criador', email.toLowerCase().trim())
    .in('status', ['active', 'draft'])
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
