import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente admin para operações de storage e insert sem RLS
const admin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

// Verifica se o email é dono da página com esse slug
async function verificarDono(slug: string, email: string) {
  const sb = admin()
  const { data } = await sb
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .eq('email_criador', email)
    .single()
  return data?.id ?? null
}

// GET /api/momentos?slug=X&email=Y
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug  = searchParams.get('slug')  ?? ''
  const email = searchParams.get('email') ?? ''

  const pageId = await verificarDono(slug, email)
  if (!pageId) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { data } = await admin()
    .from('momentos')
    .select('*')
    .eq('page_id', pageId)
    .order('ordem', { ascending: true })

  return NextResponse.json({ momentos: data ?? [] })
}

// POST /api/momentos  (multipart/form-data)
// Campos: slug, email, titulo, descricao?, data?, foto?
export async function POST(req: NextRequest) {
  const form   = await req.formData()
  const slug   = form.get('slug')   as string
  const email  = form.get('email')  as string
  const titulo = form.get('titulo') as string
  const descricao = (form.get('descricao') as string) || null
  const data      = (form.get('data')      as string) || null
  const foto      = form.get('foto') as File | null

  if (!slug || !email || !titulo) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  const pageId = await verificarDono(slug, email)
  if (!pageId) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const sb = admin()
  let foto_url: string | null = null

  // Upload da foto se enviada
  if (foto && foto.size > 0) {
    const ext = foto.name.split('.').pop() ?? 'jpg'
    const path = `${pageId}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await foto.arrayBuffer())

    const { error: uploadErr } = await sb.storage
      .from('fotos-momentos')
      .upload(path, buffer, { contentType: foto.type, upsert: false })

    if (uploadErr) {
      return NextResponse.json({ error: `Erro no upload: ${uploadErr.message}` }, { status: 500 })
    }

    const { data: urlData } = sb.storage.from('fotos-momentos').getPublicUrl(path)
    foto_url = urlData.publicUrl
  }

  // Ordem: último existente + 1
  const { data: last } = await sb
    .from('momentos')
    .select('ordem')
    .eq('page_id', pageId)
    .order('ordem', { ascending: false })
    .limit(1)
    .single()

  const ordem = (last?.ordem ?? -1) + 1

  const { data: novo, error: insertErr } = await sb
    .from('momentos')
    .insert({ page_id: pageId, titulo, descricao, data, foto_url, ordem })
    .select()
    .single()

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  return NextResponse.json({ momento: novo })
}
