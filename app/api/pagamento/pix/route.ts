import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const { pageId, cpf, email } = await req.json()

    if (!pageId || !cpf) {
      return NextResponse.json({ error: 'pageId e CPF são obrigatórios' }, { status: 400 })
    }

    const payment = new Payment(mpClient)
    const valor = Number(process.env.MP_UNIT_PRICE ?? 19.9)
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br'

    const response = await payment.create({
      body: {
        transaction_amount: valor,
        description: 'Envelope Lacrado - Pagina de Relacionamento Vitalicia',
        payment_method_id: 'pix',
        payer: {
          email: email || 'comprador@envelopelacrado.com.br',
          identification: {
            type: 'CPF',
            number: cpf.replace(/\D/g, ''),
          },
        },
        external_reference: pageId,
        notification_url: `${baseUrl}/api/pagamento/webhook`,
      },
    })

    const txData = response.point_of_interaction?.transaction_data

    return NextResponse.json({
      paymentId: response.id,
      qrCode: txData?.qr_code,
      qrCodeBase64: txData?.qr_code_base64,
      status: response.status,
    })
  } catch (error: any) {
    console.error('[pagamento/pix] Erro:', JSON.stringify(error?.cause ?? error, null, 2))
    return NextResponse.json(
      { error: error?.cause?.message ?? 'Erro ao gerar Pix' },
      { status: 500 }
    )
  }
}
