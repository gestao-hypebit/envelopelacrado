import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get('paymentId')
  if (!paymentId) {
    return NextResponse.json({ error: 'paymentId obrigatório' }, { status: 400 })
  }

  try {
    const payment = new Payment(mpClient)
    const response = await payment.get({ id: paymentId })
    return NextResponse.json({ status: response.status })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao consultar pagamento' }, { status: 500 })
  }
}
