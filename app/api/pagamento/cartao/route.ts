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

    const paymentId = response.id
    const status = response.status
    const statusDetail = response.status_detail

    console.log('[pagamento/cartao] status:', status, '| detail:', statusDetail, '| id:', paymentId)

    // O SDK do MP pode não incluir three_ds_info — busca da API bruta como fallback
    let threeDsInfo = (response as any).three_ds_info ?? null
    if (!threeDsInfo && statusDetail === 'pending_challenge' && paymentId) {
      try {
        const raw = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
        })
        const full = await raw.json()
        threeDsInfo = full.three_ds_info ?? null
        console.log('[pagamento/cartao] three_ds_info via raw API:', JSON.stringify(threeDsInfo))
      } catch (e) {
        console.error('[pagamento/cartao] falha ao buscar three_ds_info:', e)
      }
    }

    return NextResponse.json({
      status,
      statusDetail,
      paymentId,
      threeDsInfo,
    })
  } catch (error: any) {
    console.error('[pagamento/cartao]', JSON.stringify(error?.cause ?? error, null, 2))
    return NextResponse.json(
      { error: error?.cause?.message ?? 'Erro ao processar cartão' },
      { status: 500 }
    )
  }
}
