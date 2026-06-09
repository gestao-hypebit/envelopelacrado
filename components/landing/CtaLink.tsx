'use client'

import Link from 'next/link'
import { fbq } from '@/components/MetaPixel'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

/* Wrapper para CTAs da landing — dispara Lead no Meta Pixel antes de navegar */
export default function CtaLink({ onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        fbq('track', 'Lead')
        onClick?.(e)
      }}
    />
  )
}
