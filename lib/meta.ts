const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN

interface UserData {
  client_ip_address?: string
  client_user_agent?: string
  em?: string   // email hash (sha256)
  ph?: string   // phone hash
  fbc?: string  // fbclid cookie
  fbp?: string  // fbp cookie
}

interface EventPayload {
  event_name: string
  event_time: number
  action_source: 'website'
  event_source_url?: string
  event_id?: string
  user_data: UserData
  custom_data?: Record<string, unknown>
}

export async function enviarEventoMeta(payload: Omit<EventPayload, 'event_time' | 'action_source'>) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return

  const body = {
    data: [
      {
        ...payload,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website' as const,
      },
    ],
    access_token: ACCESS_TOKEN,
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      console.error('[Meta CAPI] Erro:', err)
    }
  } catch (err) {
    console.error('[Meta CAPI] Falha na requisição:', err)
  }
}

/* ── Evento de compra confirmada (Conversions API — server-side) ── */
export async function trackPurchase({
  paymentId,
  pageUrl,
  ip,
  userAgent,
  email,
}: {
  paymentId: string
  pageUrl: string
  ip?: string
  userAgent?: string
  email?: string
}) {
  await enviarEventoMeta({
    event_name: 'Purchase',
    event_id: paymentId,
    event_source_url: pageUrl,
    user_data: {
      client_ip_address: ip,
      client_user_agent: userAgent,
    },
    custom_data: {
      value: 19.90,
      currency: 'BRL',
      content_name: 'Página de Relacionamento Vitalícia',
      content_type: 'product',
    },
  })
}
