'use client'

import { useEffect } from 'react'
import { fbq } from '@/components/MetaPixel'

/* Dispara um evento fbq uma única vez quando o componente monta */
export default function TrackEvent({
  event,
  name,
  params,
}: {
  event?: 'track' | 'trackCustom'
  name: string
  params?: Record<string, unknown>
}) {
  useEffect(() => {
    fbq(event ?? 'track', name, params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
