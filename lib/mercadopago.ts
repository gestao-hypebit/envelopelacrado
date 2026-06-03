import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function criarPreferencia(pageId: string, slug: string) {
  const preference = new Preference(mpClient)
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br'

  const response = await preference.create({
    body: {
      items: [
        {
          id: pageId,
          title: 'Envelope Lacrado - Pagina de Relacionamento Vitalicia',
          quantity: 1,
          unit_price: Number(process.env.MP_UNIT_PRICE ?? 19.9),
          currency_id: 'BRL',
        },
      ],
      payment_methods: {
        installments: 12,
      },
      back_urls: {
        success: `${baseUrl}/criar/pagamento?pago=ok&slug=${slug}`,
        failure: `${baseUrl}/criar/pagamento?erro=true`,
        pending: `${baseUrl}/criar/pagamento?pendente=true`,
      },
      auto_return: 'approved',
      external_reference: pageId,
      notification_url: `${baseUrl}/api/pagamento/webhook`,
    },
  })

  return response
}

export async function buscarPagamento(paymentId: string) {
  const payment = new Payment(mpClient)
  return payment.get({ id: paymentId })
}
