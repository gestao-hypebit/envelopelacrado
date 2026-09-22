'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { setErro('Informe um email válido'); return }
    setEnviando(true)
    setErro('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setEnviado(true)
    } catch {
      setErro('Não foi possível enviar o link. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="bg-white rounded-2xl p-8 border text-center shadow-sm" style={{ borderColor: '#F5EDE3' }}>
        <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#C9768F' }} />
        <p className="font-semibold mb-1" style={{ color: '#1a0e14' }}>Verifique seu email</p>
        <p className="text-sm" style={{ color: '#A0785A' }}>
          Enviamos um link de acesso para <strong>{email}</strong>. Clique nele pra entrar.
        </p>
      </div>
    )
  }

  return (
    <motion.form onSubmit={handleEnviar}
      className="bg-white rounded-2xl p-6 border mb-8 shadow-sm"
      style={{ borderColor: '#F5EDE3' }}>
      <label className="block text-sm font-medium mb-2" style={{ color: '#1a0e14' }}>
        Seu email de compra
      </label>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C9768F' }} />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-[#C9768F]"
            style={{ borderColor: '#F5EDE3', background: '#FAFAF8' }}
          />
        </div>
        <button type="submit" disabled={enviando}
          className="px-6 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #C9768F, #b5607a)' }}>
          {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar link'}
        </button>
      </div>
      {erro && <p className="text-red-500 text-xs mt-2">{erro}</p>}
    </motion.form>
  )
}
