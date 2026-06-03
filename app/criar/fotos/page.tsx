import StepIndicator from '@/components/criar/StepIndicator'
import UploadFotos from '@/components/criar/UploadFotos'
import Link from 'next/link'

export default function FotosPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="border-b border-[#F5EDE3] bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-[#C9768F]">
            Envelope Lacrado
          </Link>
          <span className="text-sm text-gray-400">Criação em 5 passos</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-10">
          <StepIndicator stepAtual={3} />
        </div>

        <div className="mb-8">
          <span className="text-sm font-semibold text-[#C9768F] tracking-widest uppercase">Passo 3 de 5</span>
          <h1 className="font-display text-4xl font-bold text-gray-900 mt-2 mb-2">
            Fotos e momentos
          </h1>
          <p className="text-gray-500">
            Adicione fotos para cada momento. São opcionais, mas deixam a página muito mais especial.
            Até 8 fotos.
          </p>
        </div>

        <UploadFotos />
      </div>
    </div>
  )
}
