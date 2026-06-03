'use client'

import { useState, useEffect } from 'react'

interface DiffTempo {
  anos: number
  meses: number
  dias: number
  horas: number
  minutos: number
  segundos: number
  totalDias: number
}

export function useContador(dataInicio: string): DiffTempo {
  const [diff, setDiff] = useState<DiffTempo>({
    anos: 0,
    meses: 0,
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    totalDias: 0,
  })

  useEffect(() => {
    const calcular = () => {
      const inicio = new Date(dataInicio + 'T00:00:00')
      const agora = new Date()
      const totalMs = agora.getTime() - inicio.getTime()

      if (totalMs < 0) return

      const totalSegundos = Math.floor(totalMs / 1000)
      const totalDias = Math.floor(totalMs / (1000 * 60 * 60 * 24))

      const anos = Math.floor(totalDias / 365.25)
      const diasRestantesAno = totalDias - Math.floor(anos * 365.25)
      const meses = Math.floor(diasRestantesAno / 30.44)
      const dias = Math.floor(diasRestantesAno - Math.floor(meses * 30.44))

      const horas = Math.floor((totalSegundos % (24 * 3600)) / 3600)
      const minutos = Math.floor((totalSegundos % 3600) / 60)
      const segundos = totalSegundos % 60

      setDiff({ anos, meses, dias, horas, minutos, segundos, totalDias })
    }

    calcular()
    const interval = setInterval(calcular, 1000)
    return () => clearInterval(interval)
  }, [dataInicio])

  return diff
}
