// Configuração central de SEO — única fonte de verdade para nome, URL e textos da marca

export const SITE_URL = (process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br').replace(/\/$/, '')
export const SITE_NAME = 'Envelope Lacrado'
export const SITE_TITLE = 'Envelope Lacrado — Presente digital para namorados, narrado pela IA'
export const SITE_DESCRIPTION =
  'Crie uma página de amor personalizada com a história do casal narrada por IA, fotos, contador de tempo juntos e QR Code para entregar. Presente digital para Dia dos Namorados e aniversário de namoro por R$ 19,90, pagamento único.'
export const SITE_TAGLINE = 'A história de vocês, narrada pela IA'
export const PRECO = '19.90'

export const SITE_KEYWORDS = [
  'presente digital para namorado',
  'presente digital para namorada',
  'presente dia dos namorados',
  'presente criativo para namorada',
  'página de amor personalizada',
  'site para namorada',
  'surpresa para namorado',
  'presente aniversário de namoro',
  'QR code de amor',
  'contador de tempo juntos',
  'carta de amor com IA',
  'história de amor personalizada',
]

// Metadata para páginas que não devem aparecer no Google (fluxo, painel, conteúdo privado)
export const NOINDEX = { index: false, follow: true } as const
