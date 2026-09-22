import type { Metadata } from 'next'
import { NOINDEX } from '@/lib/seo'

// page.tsx é client component e não pode exportar metadata
export const metadata: Metadata = {
  title: 'Editar página',
  robots: NOINDEX,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
