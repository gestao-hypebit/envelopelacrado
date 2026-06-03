import StepIndicator from '@/components/criar/StepIndicator'
import FormularioHistoria from '@/components/criar/FormularioHistoria'
import Link from 'next/link'

export default function HistoriaPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="border-b border-[#F5EDE3] bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-[#C9768F]">
            Envelope Lacrado
          </Link>
          <span className="text-sm text-gray-400">Criação em 5 passos</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Step indicator */}
        <div className="mb-10">
          <StepIndicator stepAtual={2} />
        </div>

        {/* Título */}
        <div className="mb-8">
          <span className="text-sm font-semibold text-[#C9768F] tracking-widest uppercase">Passo 2 de 5</span>
          <h1 className="font-display text-4xl font-bold text-gray-900 mt-2 mb-2">
            Conta a história
          </h1>
          <p className="text-gray-500">
            Quanto mais detalhes você der, mais emocionante a IA vai escrever.
          </p>
        </div>

        <FormularioHistoria />
      </div>
    </div>
  )
}
