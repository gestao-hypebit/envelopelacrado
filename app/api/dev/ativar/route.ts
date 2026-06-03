import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { gerarSlug } from '@/lib/utils'

// Rota só disponível em desenvolvimento
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Não disponível em produção' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.json()
  const { dadosCriacao, dadosFotos, narrativa } = body

  let slug = gerarSlug(dadosCriacao.nome1, dadosCriacao.nome2)

  // Garante slug único
  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    slug = gerarSlug(dadosCriacao.nome1, dadosCriacao.nome2)
  }

  const { data: pagina, error } = await supabase
    .from('pages')
    .insert({
      slug,
      status: 'active',
      nome_pessoa1: dadosCriacao.nome1,
      nome_pessoa2: dadosCriacao.nome2,
      data_inicio: dadosCriacao.dataInicio,
      narrativa_ia: narrativa,
      tema: dadosCriacao.tema ?? 'classico',
      musica_url: dadosCriacao.musicaUrl ?? null,
      email_criador: dadosCriacao.email ?? null,
    })
    .select()
    .single()

  if (error || !pagina) {
    return NextResponse.json({ error: error?.message ?? 'Erro ao salvar' }, { status: 500 })
  }

  if (dadosFotos?.momentos?.length > 0) {
    await supabase.from('momentos').insert(
      dadosFotos.momentos.map((m: any, i: number) => ({
        page_id: pagina.id,
        titulo: m.titulo,
        descricao: m.descricao ?? null,
        data: m.data ?? null,
        foto_url: m.foto_url ?? null,
        ordem: i,
      }))
    )
  }

  return NextResponse.json({ slug })
}
