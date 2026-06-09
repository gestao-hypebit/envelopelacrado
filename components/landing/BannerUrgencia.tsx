'use client'

import { useEffect, useState } from 'react'

function diasParaDiaDoNamorados(): number {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const diasNam = new Date(ano, 5, 12) // 12 de junho
  if (hoje > diasNam) return 0
  return Math.ceil((diasNam.getTime() - hoje.getTime()) / 86_400_000)
}

export default function BannerUrgencia() {
  const [dias, setDias] = useState<number | null>(null)

  useEffect(() => {
    setDias(diasParaDiaDoNamorados())
  }, [])

  let texto: string
  if (dias === null) texto = '💌 Dia dos Namorados — 12 de junho — crie agora em 10 minutos'
  else if (dias === 0) texto = '💌 Hoje é o Dia dos Namorados — crie a surpresa agora!'
  else if (dias === 1) texto = '💌 Dia dos Namorados é amanhã — crie agora em 10 minutos'
  else texto = `💌 Faltam ${dias} dias para o Dia dos Namorados — crie agora`

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center py-2.5 px-10 text-xs sm:text-sm font-semibold text-white text-center"
      style={{ background: 'linear-gradient(90deg, #b5607a, #C9768F 50%, #b5607a)' }}
    >
      {texto}
    </div>
  )
}
