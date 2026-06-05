'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import { Check, Loader2, AlertCircle, Heart, Copy, CheckCheck, CreditCard, QrCode, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StepIndicator from '@/components/criar/StepIndicator'

declare global {
  interface Window {
    MercadoPago: any
  }
}

function formatarCPF(value: string) {
  return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14)
}

type Aba = 'pix' | 'cartao'

function PagamentoContent() {
  const router = useRouter()
  const [aba, setAba] = useState<Aba>('pix')
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [referralToken, setReferralToken] = useState<string | null>(null)
  const [pix, setPix] = useState<{ paymentId: string; qrCode: string; qrCodeBase64: string } | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [pago, setPago] = useState(false)
  const [ativando, setAtivando] = useState(false)
  const [sdkPronto, setSdkPronto] = useState(false)
  const [desafio3ds, setDesafio3ds] = useState<{ url: string; paymentId: string } | null>(null)
  const [cartaoPendente, setCartaoPendente] = useState<{ paymentId: string } | null>(null)
  const brickRef = useRef<any>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const polling3dsRef = useRef<NodeJS.Timeout | null>(null)
  const pollingCartaoRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const dados = sessionStorage.getItem('memoriai_step2')
    if (dados) {
      const parsed = JSON.parse(dados)
      setNome1(parsed.nome1 || '')
      setNome2(parsed.nome2 || '')
      setEmail(parsed.email || '')
    }
    const ref = sessionStorage.getItem('memoriai_referral')
    if (ref) setReferralToken(ref)
  }, [])

  // Polling para Pix
  useEffect(() => {
    if (!pix || pago) return
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/pagamento/status?paymentId=${pix.paymentId}`)
        const data = await res.json()
        if (data.status === 'approved') {
          clearInterval(pollingRef.current!)
          await ativarPagina()
        }
      } catch { /* silencioso */ }
    }, 3000)
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pix, pago])

  // Polling para 3DS — aguarda o usuário completar o desafio do banco
  useEffect(() => {
    if (!desafio3ds || pago) return
    polling3dsRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/pagamento/status?paymentId=${desafio3ds.paymentId}`)
        const data = await res.json()
        if (data.status === 'approved') {
          clearInterval(polling3dsRef.current!)
          setDesafio3ds(null)
          await ativarPagina()
        } else if (data.status === 'rejected' || data.status === 'cancelled') {
          clearInterval(polling3dsRef.current!)
          setDesafio3ds(null)
          setErro('Verificação recusada pelo banco. Tente outro cartão ou use Pix.')
        }
      } catch { /* silencioso */ }
    }, 3000)
    return () => { if (polling3dsRef.current) clearInterval(polling3dsRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desafio3ds, pago])

  // Polling para cartão em análise (in_process / pending sem 3DS)
  useEffect(() => {
    if (!cartaoPendente || pago) return
    pollingCartaoRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/pagamento/status?paymentId=${cartaoPendente.paymentId}`)
        const data = await res.json()
        if (data.status === 'approved') {
          clearInterval(pollingCartaoRef.current!)
          setCartaoPendente(null)
          await ativarPagina()
        } else if (data.status === 'rejected' || data.status === 'cancelled') {
          clearInterval(pollingCartaoRef.current!)
          setCartaoPendente(null)
          setErro('Pagamento recusado pelo banco. Tente outro cartão ou use Pix.')
        }
      } catch { /* silencioso */ }
    }, 5000)
    return () => { if (pollingCartaoRef.current) clearInterval(pollingCartaoRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartaoPendente, pago])

  // Inicializar Brick de cartão
  const inicializarBrick = useCallback(async () => {
    if (!window.MercadoPago || !sdkPronto || aba !== 'cartao') return
    if (brickRef.current) {
      try { await brickRef.current.unmount() } catch { /* */ }
      brickRef.current = null
    }

    const pageId = sessionStorage.getItem('memoriai_page_id')
    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'pt-BR' })
    const bricks = mp.bricks()

    brickRef.current = await bricks.create('cardPayment', 'brick-cartao', {
      initialization: {
        amount: Number(process.env.NEXT_PUBLIC_PRECO ?? 19.9),
        payer: { email },
      },
      customization: {
        visual: { style: { theme: 'default' } },
        paymentMethods: { maxInstallments: 12 },
      },
      callbacks: {
        onReady: () => {},
        onError: (error: any) => {
          console.error('[brick] erro:', error)
          setErro('Erro no formulário de cartão.')
        },
        onSubmit: async (cardData: any) => {
          setGerando(true)
          setErro(null)
          try {
            const res = await fetch('/api/pagamento/cartao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: cardData.token,
                installments: cardData.installments,
                paymentMethodId: cardData.payment_method_id,
                issuerId: cardData.issuer_id,
                payer: cardData.payer,
                additionalData: cardData.additional_data ?? null,
                pageId,
              }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            if (data.status === 'approved') {
              await ativarPagina()
            } else if (data.statusDetail === 'pending_challenge' && data.threeDsInfo?.external_resource_url) {
              // Banco exige verificação 3DS — exibe iframe inline
              setDesafio3ds({ url: data.threeDsInfo.external_resource_url, paymentId: String(data.paymentId) })
            } else if (data.status === 'in_process' || data.status === 'pending') {
              // Pagamento em análise (antifraude / revisão manual) — faz polling até resolver
              setCartaoPendente({ paymentId: String(data.paymentId) })
            } else {
              const MSGS: Record<string, string> = {
                cc_rejected_insufficient_amount: 'Saldo insuficiente no cartão.',
                cc_rejected_bad_filled_security_code: 'Código de segurança incorreto.',
                cc_rejected_bad_filled_date: 'Data de validade incorreta.',
                cc_rejected_bad_filled_card_number: 'Número do cartão incorreto.',
                cc_rejected_call_for_authorize: 'Ligue para o banco para autorizar o pagamento.',
                cc_rejected_card_disabled: 'Cartão bloqueado. Entre em contato com o banco.',
                cc_rejected_duplicated_payment: 'Pagamento duplicado. Aguarde alguns minutos.',
              }
              const msg = MSGS[data.statusDetail] ?? 'Pagamento recusado. Tente outro cartão ou use Pix.'
              setErro(msg)
            }
          } catch (err: any) {
            setErro(err.message || 'Erro ao processar cartão.')
          } finally {
            setGerando(false)
          }
        },
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkPronto, aba, email])

  useEffect(() => {
    if (aba === 'cartao' && sdkPronto) {
      inicializarBrick()
    }
    return () => {
      if (brickRef.current && aba !== 'cartao') {
        try { brickRef.current.unmount() } catch { /* */ }
        brickRef.current = null
      }
    }
  }, [aba, sdkPronto, inicializarBrick])

  const ativarViaReferral = async () => {
    const pageId = sessionStorage.getItem('memoriai_page_id')
    if (!pageId || !referralToken) return
    setGerando(true)
    setErro(null)
    try {
      const res = await fetch('/api/referral/usar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: referralToken, pageId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      sessionStorage.removeItem('memoriai_referral')
      setPago(true)
    } catch (err: any) {
      setErro(err.message || 'Link de convite inválido. Tente o pagamento normal.')
      setReferralToken(null)
    } finally {
      setGerando(false)
    }
  }

  const ativarPagina = async () => {
    const slug = sessionStorage.getItem('memoriai_slug')
    if (!slug) return
    setAtivando(true)
    try {
      await fetch('/api/paginas/ativar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      setPago(true)
    } finally {
      setAtivando(false)
    }
  }

  const handleGerarPix = async () => {
    const pageId = sessionStorage.getItem('memoriai_page_id')
    if (!pageId) { setErro('Dados da sessão perdidos. Volte ao início.'); return }
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) { setErro('Informe um CPF válido.'); return }
    setGerando(true)
    setErro(null)
    try {
      const res = await fetch('/api/pagamento/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, cpf, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPix({ paymentId: String(data.paymentId), qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64 })
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setGerando(false)
    }
  }

  const handleCopiar = async () => {
    if (!pix?.qrCode) return
    await navigator.clipboard.writeText(pix.qrCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  const slug = typeof window !== 'undefined' ? sessionStorage.getItem('memoriai_slug') : null

  if (ativando) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C9768F] mx-auto mb-4" />
          <p className="text-gray-500">Pagamento confirmado! Ativando sua página...</p>
        </div>
      </div>
    )
  }

  if (pago) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">Pagamento confirmado!</h1>
          <p className="text-gray-500 mb-8">A página de {nome1} e {nome2} está no ar. Você vai receber o QR Code por email.</p>
          {slug && (
            <Link href={`/p/${slug}`}>
              <Button size="lg" className="w-full"><Heart className="w-5 h-5" />Ver minha página</Button>
            </Link>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        onLoad={() => setSdkPronto(true)}
      />

      <div className="min-h-screen bg-[#FAFAF8]">
        <header className="border-b border-[#F5EDE3] bg-white sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold text-[#C9768F]">Envelope Lacrado</Link>
            <span className="text-sm text-gray-400">Criação em 5 passos</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="mb-10"><StepIndicator stepAtual={5} /></div>

          <div className="mb-8">
            <span className="text-sm font-semibold text-[#C9768F] tracking-widest uppercase">Passo 5 de 5</span>
            <h1 className="font-display text-4xl font-bold text-gray-900 mt-2 mb-2">Finalizar</h1>
            <p className="text-gray-500">Um pagamento único. A página fica no ar para sempre.</p>
          </div>

          {/* Resumo */}
          <div className="bg-white rounded-3xl border border-[#F5EDE3] overflow-hidden shadow-lg mb-6">
            <div className="p-5 text-center" style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
              <h2 className="font-display text-xl font-bold text-white">Página de {nome1 || '...'} & {nome2 || '...'}</h2>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-gray-600 text-sm">Página vitalícia com IA</span>
              <span className="font-display text-2xl font-bold text-[#C9768F]">R$ 19,90</span>
            </div>
          </div>

          {/* Referral — página gratuita */}
          {referralToken && !pix && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-3xl p-6 shadow-lg mb-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-green-800 text-sm">Você ganhou uma página gratuita! 🎉</p>
                  <p className="text-green-700 text-xs">Nenhum pagamento necessário.</p>
                </div>
              </div>
              {erro && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 mb-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{erro}</p>
                </div>
              )}
              <button
                onClick={ativarViaReferral}
                disabled={gerando}
                className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              >
                {gerando
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Ativando...</>
                  : <><Heart className="w-5 h-5 fill-white" /> Ativar minha página gratuitamente</>
                }
              </button>
              <p className="text-xs text-green-600 text-center mt-3 opacity-70">
                ou pague normalmente abaixo se preferir apoiar o projeto ♥
              </p>
            </motion.div>
          )}

          {/* Abas */}
          {!pix && (
            <div className="flex gap-2 mb-4">
              {(['pix', 'cartao'] as Aba[]).map((a) => (
                <button
                  key={a}
                  onClick={() => { setAba(a); setErro(null) }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                    aba === a
                      ? 'border-[#C9768F] bg-[#FEF2F5] text-[#C9768F]'
                      : 'border-gray-200 text-gray-500 hover:border-[#C9768F]'
                  }`}
                >
                  {a === 'pix' ? <QrCode className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  {a === 'pix' ? 'Pix' : 'Cartão de Crédito'}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {aba === 'pix' && (
              <motion.div key="pix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {!pix ? (
                  <div className="bg-white rounded-3xl border border-[#F5EDE3] p-6 shadow-lg space-y-4">
                    <h3 className="font-semibold text-gray-900">Dados para o Pix</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(formatarCPF(e.target.value))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9768F] focus:ring-1 focus:ring-[#C9768F]"
                      />
                    </div>
                    {erro && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm">{erro}</p>
                      </div>
                    )}
                    <Button size="xl" onClick={handleGerarPix} disabled={gerando} className="w-full shadow-lg">
                      {gerando ? <><Loader2 className="w-5 h-5 animate-spin" /> Gerando QR Code...</> : 'Gerar QR Code Pix →'}
                    </Button>
                    <Button variant="ghost" onClick={() => router.push('/criar/preview')} className="w-full text-sm">← Voltar ao preview</Button>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#F5EDE3] p-6 shadow-lg text-center space-y-5">
                    <div>
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-1">Escaneie o QR Code</h3>
                      <p className="text-gray-500 text-sm">Abra o app do seu banco e escaneie para pagar</p>
                    </div>
                    {pix.qrCodeBase64 && (
                      <div className="flex justify-center">
                        <img src={`data:image/png;base64,${pix.qrCodeBase64}`} alt="QR Code Pix" className="w-52 h-52 rounded-xl border border-[#F5EDE3]" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Ou copie o código Pix:</p>
                      <button onClick={handleCopiar} className="w-full flex items-center justify-between gap-2 bg-[#FAFAF8] border border-[#F5EDE3] rounded-xl px-4 py-3 text-xs text-gray-500 hover:border-[#C9768F] transition-colors">
                        <span className="truncate text-left">{pix.qrCode}</span>
                        {copiado ? <CheckCheck className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Copy className="w-4 h-4 flex-shrink-0" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FEF2F5] rounded-xl p-3">
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9768F] flex-shrink-0" />
                      <p className="text-sm text-[#C9768F]">Aguardando confirmação do pagamento...</p>
                    </div>
                    <p className="text-xs text-gray-400">Após o pagamento, você será redirecionado automaticamente.</p>
                  </div>
                )}
              </motion.div>
            )}

            {aba === 'cartao' && (
              <motion.div key="cartao" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Desafio 3DS — exibido quando o banco exige verificação extra */}
                {desafio3ds ? (
                  <div className="bg-white rounded-3xl border border-[#F5EDE3] p-6 shadow-lg space-y-4">
                    <div className="text-center space-y-1">
                      <p className="font-semibold text-gray-900">Verificação do seu banco</p>
                      <p className="text-sm text-gray-500">
                        Complete a autenticação solicitada pelo seu banco para finalizar o pagamento.
                      </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-[#F5EDE3]" style={{ minHeight: 400 }}>
                      <iframe
                        src={desafio3ds.url}
                        width="100%"
                        height="420"
                        className="border-0 block"
                        title="Verificação 3D Secure"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-[#FEF2F5] rounded-xl p-3">
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9768F] flex-shrink-0" />
                      <p className="text-sm text-[#C9768F]">Aguardando confirmação do banco...</p>
                    </div>
                  </div>
                ) : cartaoPendente ? (
                  <div className="bg-white rounded-3xl border border-[#F5EDE3] p-6 shadow-lg text-center space-y-5">
                    <div className="w-16 h-16 rounded-full bg-[#FEF2F5] flex items-center justify-center mx-auto">
                      <Loader2 className="w-7 h-7 animate-spin text-[#C9768F]" />
                    </div>
                    <div>
                      <p className="font-display text-xl font-bold text-gray-900 mb-1">Pagamento em análise</p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Seu banco está analisando o pagamento. Isso pode levar alguns instantes.<br />
                        Você será redirecionado automaticamente quando aprovado.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FEF2F5] rounded-xl p-3 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9768F] flex-shrink-0" />
                      <p className="text-sm text-[#C9768F]">Aguardando aprovação do banco...</p>
                    </div>
                    <p className="text-xs text-gray-400">Não feche esta página.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#F5EDE3] p-6 shadow-lg space-y-4">
                    {erro && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm">{erro}</p>
                      </div>
                    )}
                    {!sdkPronto ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C9768F]" />
                      </div>
                    ) : (
                      <div id="brick-cartao" />
                    )}
                    <Button variant="ghost" onClick={() => router.push('/criar/preview')} className="w-full text-sm">← Voltar ao preview</Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C9768F]" /></div>}>
      <PagamentoContent />
    </Suspense>
  )
}
