import { Resend } from 'resend'
import type { Pagina } from '@/types'

export async function enviarEmailConfirmacao(page: Pagina) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br'
  const urlPagina = `${baseUrl}/p/${page.slug}`
  const qrCodeUrl = `${baseUrl}/api/qrcode?url=${encodeURIComponent(urlPagina)}`

  if (!page.email_criador) return

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'Envelope Lacrado <onboarding@resend.dev>',
    to: page.email_criador,
    subject: `Sua surpresa está pronta, ${page.nome_pessoa1}!`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Georgia, serif; background: #FAFAF8; color: #1a1a1a; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 28px; color: #C9768F; font-weight: bold; letter-spacing: -0.5px; }
          h1 { font-size: 32px; color: #C9768F; margin: 20px 0 10px; }
          p { font-size: 16px; line-height: 1.6; color: #444; margin: 10px 0; }
          .btn { display: inline-block; background: #C9768F; color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-size: 16px; font-weight: 600; margin: 20px 0; }
          .qr-section { background: #F5EDE3; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; }
          .qr-section h2 { color: #C9768F; margin-bottom: 15px; }
          .footer { text-align: center; margin-top: 40px; color: #999; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Envelope Lacrado</div>
          </div>

          <h1>Sua surpresa está pronta!</h1>
          <p>Olá, ${page.nome_pessoa1}!</p>
          <p>A página de <strong>${page.nome_pessoa1} e ${page.nome_pessoa2}</strong> foi criada com sucesso e já está no ar.</p>

          <div style="text-align: center;">
            <a href="${urlPagina}" class="btn">Ver minha página</a>
          </div>

          <div class="qr-section">
            <h2>QR Code para imprimir</h2>
            <p>Imprima o QR Code abaixo, coloque em um bilhetinho caprichado e entregue para ${page.nome_pessoa2}. Quando escanear, vai abrir direto na surpresa!</p>
            <img src="${qrCodeUrl}" width="180" height="180" alt="QR Code" style="margin: 20px auto; display: block;" />
            <p style="font-size: 13px; color: #888;">${urlPagina}</p>
          </div>

          <p>A página fica no ar para sempre — é sua para a vida toda.</p>

          <div class="footer">
            <p>Feito com amor no Brasil</p>
            <p><a href="${baseUrl}" style="color: #C9768F;">envelopelacrado.com.br</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}
