import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, installments, paymentMethodId, issuerId, payer, pageId } = body

    if (!token || !pageId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const valor = Number(process.env.MP_UNIT_PRICE ?? 19.9)
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br'

    const payment = new Payment(mpClient)
    const response = await payment.create({
      body: {
        transaction_amount: valor,
        token,
        installments: Number(installments) || 1,
        payment_method_id: paymentMethodId,
        issuer_id: issuerId,
        description: 'Envelope Lacrado - Pagina de Relacionamento Vitalicia',
        payer: {
          email: payer?.email,
          identification: payer?.identification,
        },
        external_reference: pageId,
        notification_url: `${baseUrl}/api/pagamento/webhook`,
      },
    })

    return NextResponse.json({
      status: response.status,
      statusDetail: response.status_detail,
      paymentId: response.id,
    })
  } catch (error: any) {
    console.error('[pagamento/cartao]', JSON.stringify(error?.cause ?? error, null, 2))
    return NextResponse.json(
      { error: error?.cause?.message ?? 'Erro ao processar cartão' },
      { status: 500 }
    )
  }
}
