import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user?.email) {
      // Páginas criadas antes do login (fluxo de compra é anônimo) só têm
      // email_criador. Ao confirmar o email por magic link, vinculamos essas
      // páginas ao usuário autenticado — é a única forma de "reivindicá-las",
      // já que a policy de dono exige auth.uid() = user_id.
      const admin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      await admin
        .from('pages')
        .update({ user_id: data.user.id })
        .is('user_id', null)
        .eq('email_criador', data.user.email.toLowerCase().trim())

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/dashboard?erro=auth`)
}
