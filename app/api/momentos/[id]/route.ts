import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

// DELETE /api/momentos/[id]
// Body: { slug, email }
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { slug, email } = await req.json()

  if (!slug || !email) {
    return NextResponse.json({ error: 'slug e email obrigatórios' }, { status: 400 })
  }

  const sb = admin()

  // Verificar dono
  const { data: page } = await sb
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .eq('email_criador', email)
    .single()

  if (!page) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  // Verificar que o momento pertence a essa página
  const { data: momento } = await sb
    .from('momentos')
    .select('id, foto_url, page_id')
    .eq('id', id)
    .eq('page_id', page.id)
    .single()

  if (!momento) return NextResponse.json({ error: 'Momento não encontrado' }, { status: 404 })

  // Remover foto do storage se existir
  if (momento.foto_url) {
    const url = new URL(momento.foto_url)
    // path after /storage/v1/object/public/fotos-momentos/
    const pathParts = url.pathname.split('/fotos-momentos/')
    if (pathParts[1]) {
      await sb.storage.from('fotos-momentos').remove([pathParts[1]])
    }
  }

  await sb.from('momentos').delete().eq('id', id)

  return NextResponse.json({ ok: true })
}
