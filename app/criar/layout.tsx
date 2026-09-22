import type { Metadata } from 'next'

// page.tsx é client component e não pode exportar metadata
export const metadata: Metadata = {
  title: 'Criar presente digital para namorados',
  description: 'Monte em menos de 10 minutos uma página de amor personalizada: a IA narra a história do casal, com fotos, contador de tempo juntos e QR Code. R$ 19,90, pagamento único.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
