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
        issuer_id: issuerId ? Number(issuerId) : undefined,
        description: 'Envelope Lacrado - Pagina de Relacionamento Vitalicia',
        // Necessário para cartões brasileiros — reduz rejeições por antifraude
        three_d_secure_mode: 'optional',
        payer: {
          email: payer?.email,
          identification: payer?.identification,
        },
        additional_info: {
          items: [
            {
              id: pageId,
              title: 'Envelope Lacrado - Pagina de Relacionamento Vitalicia',
              description: 'Pagina digital de relacionamento vitalicias',
              category_id: 'services',
              quantity: 1,
              unit_price: valor,
            },
          ],
          payer: {
            first_name: payer?.firstName || payer?.name || '',
            last_name: payer?.lastName || '',
          },
        },
        external_reference: pageId,
        notification_url: `${baseUrl}/api/pagamento/webhook`,
      } as any,
    })

    // Se o emissor exigiu 3DS, retorna os dados para o front completar o desafio
    const res3ds = (response as any).three_ds_info
    return NextResponse.json({
      status: response.status,
      statusDetail: response.status_detail,
      paymentId: response.id,
      threeDsInfo: res3ds ?? null,
    })
  } catch (error: any) {
    console.error('[pagamento/cartao]', JSON.stringify(error?.cause ?? error, null, 2))
    return NextResponse.json(
      { error: error?.cause?.message ?? 'Erro ao processar cartão' },
      { status: 500 }
    )
  }
}
