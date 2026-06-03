'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import { Check, Loader2, AlertCircle, Heart, Copy, CheckCheck, CreditCard, QrCode } from 'lucide-react'
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
  const [pix, setPix] = useState<{ paymentId: string; qrCode: string; qrCodeBase64: string } | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [pago, setPago] = useState(false)
  const [ativando, setAtivando] = useState(false)
  const [sdkPronto, setSdkPronto] = useState(false)
  const brickRef = useRef<any>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const dados = sessionStorage.getItem('memoriai_step2')
    if (dados) {
      const parsed = JSON.parse(dados)
      setNome1(parsed.nome1 || '')
      setNome2(parsed.nome2 || '')
      setEmail(parsed.email || '')
    }
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
                pageId,
              }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            if (data.status === 'approved') {
              await ativarPagina()
            } else {
              setErro(`Pagamento ${data.status === 'rejected' ? 'recusado' : 'pendente'}. Tente outro cartão.`)
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
