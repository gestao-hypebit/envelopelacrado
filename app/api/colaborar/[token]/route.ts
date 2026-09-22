import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!token) return NextResponse.json({ error: 'Token obrigatório' }, { status: 400 })

  const { data } = await supabase
    .from('pages')
    .select('id, nome_pessoa1, nome_pessoa2, colaboracao_prazo, tema, colaboracao_ativa')
    .eq('colaboracao_token', token)
    .eq('status', 'active')
    .single()

  if (!data) {
    return NextResponse.json({ error: 'Link de colaboração inválido ou expirado.' }, { status: 404 })
  }

  if (!data.colaboracao_ativa) {
    return NextResponse.json({ error: 'Colaboração não está ativa para esta página.' }, { status: 403 })
  }

  if (data.colaboracao_prazo && new Date(data.colaboracao_prazo) < new Date()) {
    return NextResponse.json({ error: 'Link expirado.', expirado: true }, { status: 410 })
  }

  return NextResponse.json({
    id: data.id,
    nome_pessoa1: data.nome_pessoa1,
    nome_pessoa2: data.nome_pessoa2,
    tema: data.tema,
  })
}
