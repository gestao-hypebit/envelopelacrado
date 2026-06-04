import { Resend } from 'resend'
import type { Pagina } from '@/types'
import { gerarQRCodeDataURL } from '@/lib/qrcode'

export async function enviarEmailConfirmacao(page: Pagina) {
  if (!page.email_criador) return

  const resend  = new Resend(process.env.RESEND_API_KEY)
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br'
  const urlPagina = `${baseUrl}/p/${page.slug}`

  // QR Code embutido como base64 — renderiza em todos os clientes de email
  const qrDataUrl = await gerarQRCodeDataURL(urlPagina)

  const nome1 = page.nome_pessoa1
  const nome2 = page.nome_pessoa2

  const html = `<!DOCTYPE html>
<html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Sua surpresa está pronta!</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EDE3;font-family:Georgia,'Times New Roman',serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <!-- Preheader oculto -->
  <div style="display:none;max-height:0;overflow:hidden;color:#F5EDE3;font-size:1px;">
    A página de ${nome1} e ${nome2} está pronta! Imprima o QR Code e entregue a surpresa ♥
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5EDE3;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card principal -->
        <table width="560" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px;width:100%;background-color:#ffffff;border-radius:24px;overflow:hidden;">

          <!-- ══ HEADER ══ -->
          <tr>
            <td align="center" style="background-color:#C9768F;padding:28px 40px;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">
                ENVELOPE LACRADO
              </p>
              <p style="margin:6px 0 0;font-size:26px;color:#ffffff;font-family:Georgia,serif;font-weight:700;letter-spacing:-0.5px;">
                💌 Sua surpresa está pronta!
              </p>
            </td>
          </tr>

          <!-- ══ HERO — NOMES ══ -->
          <tr>
            <td align="center" style="padding:52px 48px 36px;background-color:#ffffff;">
              <p style="margin:0 0 16px;font-size:11px;color:#C9768F;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">
                ✦ UNIDOS PARA SEMPRE ✦
              </p>
              <h1 style="margin:0;font-size:40px;color:#1a0e14;line-height:1.1;font-family:Georgia,serif;font-weight:700;">
                ${nome1} &amp; ${nome2}
              </h1>
              <p style="margin:16px 0 0;font-size:15px;color:#888;font-family:Arial,sans-serif;line-height:1.65;">
                A página foi criada com sucesso e já está no ar.<br>
                Agora é hora de entregar a surpresa! 🎁
              </p>
            </td>
          </tr>

          <!-- ══ CTA BUTTON ══ -->
          <tr>
            <td align="center" style="padding:0 48px 52px;background-color:#ffffff;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:#C9768F;border-radius:50px;">
                    <a href="${urlPagina}"
                      style="display:inline-block;padding:16px 44px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;letter-spacing:0.2px;border-radius:50px;">
                      Ver a página →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-size:11px;color:#bbb;font-family:Arial,sans-serif;word-break:break-all;">
                ${urlPagina}
              </p>
            </td>
          </tr>

          <!-- ══ DIVISOR ══ -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:1px;background-color:#F5EDE3;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- ══ QR CODE ══ -->
          <tr>
            <td align="center" style="padding:52px 48px 40px;background-color:#ffffff;">
              <p style="margin:0 0 8px;font-size:11px;color:#C9768F;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">
                QR CODE PARA IMPRIMIR
              </p>
              <h2 style="margin:0 0 14px;font-size:26px;color:#1a0e14;font-family:Georgia,serif;font-weight:700;">
                Entregue a surpresa para ${nome2}
              </h2>
              <p style="margin:0 0 36px;font-size:14px;color:#888;font-family:Arial,sans-serif;line-height:1.7;">
                Imprima o código abaixo, coloque num bilhetinho ou cartão<br>
                e entregue para ${nome2}. Ao apontar a câmera para o código,<br>
                abre direto na surpresa. ♥
              </p>

              <!-- Moldura do QR Code -->
              <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#F5EDE3;padding:28px;border-radius:20px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#ffffff;padding:12px;border-radius:12px;">
                          <img src="${qrDataUrl}"
                            width="200" height="200"
                            alt="QR Code — ${urlPagina}"
                            style="display:block;border:0;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:11px;color:#bbb;font-family:Arial,sans-serif;word-break:break-all;">
                ${urlPagina}
              </p>
            </td>
          </tr>

          <!-- ══ DIVISOR ══ -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:1px;background-color:#F5EDE3;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- ══ COMO ENTREGAR ══ -->
          <tr>
            <td style="padding:52px 48px 48px;background-color:#ffffff;">
              <p style="margin:0 0 32px;font-size:11px;color:#C9768F;letter-spacing:3px;text-transform:uppercase;text-align:center;font-family:Arial,sans-serif;">
                COMO ENTREGAR
              </p>

              <!-- Passo 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td width="56" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width:44px;height:44px;background-color:#F5EDE3;border-radius:50%;font-size:20px;line-height:44px;">
                          🖨️
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="top" style="padding-top:4px;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1a0e14;font-family:Arial,sans-serif;">
                      Imprima o QR Code
                    </p>
                    <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;line-height:1.55;">
                      Tire um print deste email ou salve o código acima. Pode imprimir em qualquer tamanho.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Passo 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td width="56" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width:44px;height:44px;background-color:#F5EDE3;border-radius:50%;font-size:20px;line-height:44px;">
                          💌
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="top" style="padding-top:4px;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1a0e14;font-family:Arial,sans-serif;">
                      Escreva um bilhetinho
                    </p>
                    <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;line-height:1.55;">
                      Coloque o QR Code dentro de um envelope, cartão ou moldura. Um bilhete à mão faz toda a diferença.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Passo 3 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="56" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width:44px;height:44px;background-color:#F5EDE3;border-radius:50%;font-size:20px;line-height:44px;">
                          📱
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="top" style="padding-top:4px;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1a0e14;font-family:Arial,sans-serif;">
                      Entregue e assista a reação
                    </p>
                    <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;line-height:1.55;">
                      ${nome2} aponta a câmera para o código e é levado direto para a surpresa. Tenha lenços à mão. 🥹
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ DIVISOR ══ -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:1px;background-color:#F5EDE3;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- ══ EDITAR ══ -->
          <tr>
            <td align="center" style="padding:36px 48px;background-color:#FAFAF8;">
              <p style="margin:0 0 8px;font-size:14px;color:#888;font-family:Arial,sans-serif;">
                Quer adicionar mais fotos ou editar a narrativa?
              </p>
              <a href="${baseUrl}/dashboard"
                style="font-size:14px;color:#C9768F;font-family:Arial,sans-serif;text-decoration:underline;">
                Acesse o painel de edição →
              </a>
            </td>
          </tr>

          <!-- ══ FOOTER ESCURO ══ -->
          <tr>
            <td align="center" style="padding:32px 48px 36px;background-color:#1a0e14;">
              <p style="margin:0 0 10px;font-size:20px;">💕</p>
              <p style="margin:0 0 8px;font-size:13px;color:rgba(240,228,212,0.5);font-family:Arial,sans-serif;">
                A página fica no ar para sempre — é sua para a vida toda.
              </p>
              <p style="margin:0;font-size:12px;color:rgba(240,228,212,0.28);font-family:Arial,sans-serif;">
                Feito com amor no Brasil &nbsp;·&nbsp;
                <a href="${baseUrl}" style="color:#C9768F;text-decoration:none;">envelopelacrado.com.br</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Rodapé externo -->
        <p style="margin:24px 0 0;font-size:11px;color:rgba(0,0,0,0.3);font-family:Arial,sans-serif;text-align:center;">
          Você recebeu este email pois criou uma página no Envelope Lacrado com este endereço.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'Envelope Lacrado <ola@envelopelacrado.com.br>',
    to: page.email_criador,
    subject: `💌 Sua surpresa está pronta, ${nome1}!`,
    html,
  })
}
