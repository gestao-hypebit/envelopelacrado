import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { gerarSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.json()
  const { dadosCriacao, dadosFotos, narrativa } = body

  if (!dadosCriacao?.nome1 || !dadosCriacao?.nome2 || !dadosCriacao?.dataInicio) {
    return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 })
  }

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
      status: 'draft',
      nome_pessoa1: dadosCriacao.nome1,
      nome_pessoa2: dadosCriacao.nome2,
      data_inicio: dadosCriacao.dataInicio,
      narrativa_ia: narrativa || null,
      tema: dadosCriacao.tema ?? 'classico',
      musica_url: dadosCriacao.musicaUrl ?? null,
      email_criador: dadosCriacao.email ?? null,
    })
    .select('id, slug')
    .single()

  if (error || !pagina) {
    console.error('[paginas/criar]', error?.message)
    return NextResponse.json({ error: 'Erro ao salvar página' }, { status: 500 })
  }

  // Salva momentos
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

  return NextResponse.json({ id: pagina.id, slug: pagina.slug })
}
