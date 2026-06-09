'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function StickyCtaMobile() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-3 lg:hidden"
      style={{
        background: 'rgba(250,250,248,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #F5EDE3',
        boxShadow: '0 -4px 24px rgba(201,118,143,0.15)',
      }}
    >
      <Link
        href="/criar"
        className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base w-full"
        style={{
          background: 'linear-gradient(135deg, #C9768F, #b5607a)',
          boxShadow: '0 6px 20px rgba(201,118,143,0.4)',
        }}
      >
        Criar agora por R$ 19,90
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  )
}
