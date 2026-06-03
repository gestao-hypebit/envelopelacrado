import StepIndicator from '@/components/criar/StepIndicator'
import PreviewPage from '@/components/criar/PreviewPage'
import Link from 'next/link'

export default function PreviewRoute() {
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
          <StepIndicator stepAtual={4} />
        </div>

        <div className="mb-8">
          <span className="text-sm font-semibold text-[#C9768F] tracking-widest uppercase">Passo 4 de 5</span>
          <h1 className="font-display text-4xl font-bold text-gray-900 mt-2 mb-2">
            Preview da página
          </h1>
          <p className="text-gray-500">
            Veja como vai ficar. Se quiser, regenere a narrativa com outro tom.
          </p>
        </div>

        <PreviewPage />
      </div>
    </div>
  )
}
