import type { Metadata } from 'next'
import './globals.css'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import MetaPixel from '@/components/MetaPixel'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Envelope Lacrado — A história de vocês, narrada pela IA',
    template: '%s | Envelope Lacrado',
  },
  description: 'Transforme os momentos do casal em uma página inesquecível. Presente digital que emociona de verdade, criado com inteligência artificial.',
  keywords: ['presente digital', 'casal', 'aniversário', 'namorados', 'inteligência artificial', 'história de amor'],
  authors: [{ name: 'Envelope Lacrado' }],
  creator: 'Envelope Lacrado',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://envelopelacrado.com.br',
    siteName: 'Envelope Lacrado',
    title: 'Envelope Lacrado — A história de vocês, narrada pela IA',
    description: 'Transforme os momentos do casal em uma página inesquecível.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Envelope Lacrado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Envelope Lacrado — A história de vocês, narrada pela IA',
    description: 'Transforme os momentos do casal em uma página inesquecível.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  )
}
