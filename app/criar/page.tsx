'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, Gift } from 'lucide-react'
import StepIndicator from '@/components/criar/StepIndicator'
import Link from 'next/link'

function CriarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) sessionStorage.setItem('memoriai_referral', ref)
  }, [searchParams])

  const referral = searchParams.get('ref')

  const handleSelecionar = () => {
    // Limpa toda a sessão anterior para garantir fluxo limpo
    ;[
      'memoriai_step1',
      'memoriai_step2',
      'memoriai_step3',
      'memoriai_narrativa',
      'memoriai_page_id',
      'memoriai_slug',
      'memoriai_preview_token',
    ].forEach((k) => sessionStorage.removeItem(k))

    sessionStorage.setItem('memoriai_step1', JSON.stringify({ tipo: 'surpresa' }))
    router.push('/criar/historia')
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="border-b border-[#F5EDE3] bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-[#C9768F]">
            Envelope Lacrado
          </Link>
          <span className="text-sm text-gray-400">Criação em 5 passos</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-12">
          <StepIndicator stepAtual={1} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold text-[#C9768F] tracking-widest uppercase">Passo 1 de 5</span>
          <h1 className="font-display text-4xl font-bold text-gray-900 mt-3 mb-4">
            O que você quer criar?
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Escolha o tipo de página que você quer criar para o casal.
          </p>

          {/* Banner de convite gratuito */}
          {referral && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 text-left"
            >
              <Gift className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800 text-sm">Você ganhou uma página gratuita! 🎉</p>
                <p className="text-green-700 text-xs mt-0.5">Um amigo criou uma surpresa e quis te presentear também.</p>
              </div>
            </motion.div>
          )}

          {/* Card de opção */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelecionar}
            className="w-full p-8 rounded-3xl border-2 border-[#C9768F] bg-white shadow-lg hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FEF2F5] flex items-center justify-center flex-shrink-0">
                <Heart className="w-8 h-8 text-[#C9768F] fill-[#C9768F]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    Surpresa para meu amor
                  </h2>
                  <ArrowRight className="w-5 h-5 text-[#C9768F] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Crie uma página personalizada para presentear seu parceiro ou parceira.
                  A IA narra a história de vocês de forma poética e única.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(referral
                    ? ['Narrativa por IA', 'Linha do tempo', 'QR Code', 'Vitalício', '🎁 Gratuito']
                    : ['Narrativa por IA', 'Linha do tempo', 'QR Code', 'Vitalício']
                  ).map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        tag.includes('Gratuito')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-[#F5EDE3] text-[#C9768F]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>

          <p className="text-gray-400 text-sm mt-6">
            Mais tipos em breve: pedido de namoro, noivado, aniversário especial...
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function CriarPage() {
  return (
    <Suspense>
      <CriarContent />
    </Suspense>
  )
}
