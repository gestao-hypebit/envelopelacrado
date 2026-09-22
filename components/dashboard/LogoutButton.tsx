'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const [saindo, setSaindo] = useState(false)

  const handleSair = async () => {
    setSaindo(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button onClick={handleSair} disabled={saindo}
      className="flex items-center gap-1.5 text-sm disabled:opacity-60"
      style={{ color: '#A0785A' }}>
      {saindo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
      Sair
    </button>
  )
}
