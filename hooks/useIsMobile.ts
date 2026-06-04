'use client'

import { useState, useEffect } from 'react'

/**
 * Retorna true em telas menores que `breakpoint` (padrão 768px).
 * Default SSR = true (mobile-first: menos JS na hidratação inicial).
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(true)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return mobile
}
