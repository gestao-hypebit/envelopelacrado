'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  stepAtual: number
  totalSteps?: number
}

const nomeSteps = ['Tipo', 'História', 'Fotos', 'Preview', 'Pagamento']

export default function StepIndicator({ stepAtual, totalSteps = 5 }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Linha de progresso */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#F5EDE3] -z-10" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-[#C9768F] -z-10 transition-all duration-500"
          style={{ width: `${((stepAtual - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const concluido = step < stepAtual
          const atual = step === stepAtual

          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  concluido && 'bg-[#C9768F] text-white',
                  atual && 'bg-[#C9768F] text-white ring-4 ring-[#C9768F]/20 scale-110',
                  !concluido && !atual && 'bg-[#F5EDE3] text-gray-400'
                )}
              >
                {concluido ? <Check className="w-4 h-4" /> : step}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  (concluido || atual) ? 'text-[#C9768F]' : 'text-gray-400'
                )}
              >
                {nomeSteps[step - 1]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
