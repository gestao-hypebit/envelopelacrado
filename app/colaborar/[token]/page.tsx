'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send, Loader2, Heart, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface PaginaColaboracao {
  id: string
  nome_pessoa1: string
  nome_pessoa2: string
  colaboracao_prazo: string | null
  tema: string
}

export default function ColaborarPage() {
  const params = useParams()
  const token = params.token as string

  const [pagina, setPagina] = useState<PaginaColaboracao | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [expirado, setExpirado] = useState(false)

  const [nomeAutor, setNomeAutor] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  useEffect(() => {
    const buscar = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('pages')
          .select('id, nome_pessoa1, nome_pessoa2, colaboracao_prazo, tema, colaboracao_ativa')
          .eq('colaboracao_token', token)
          .eq('status', 'active')
          .single()

        if (error || !data) {
          setErro('Link de colaboração inválido ou expirado.')
          return
        }

        if (!data.colaboracao_ativa) {
          setErro('Colaboração não está ativa para esta página.')
          return
        }

        // Verificar prazo
        if (data.colaboracao_prazo && new Date(data.colaboracao_prazo) < new Date()) {
          setExpirado(true)
          return
        }

        setPagina(data)
      } catch {
        setErro('Erro ao carregar página.')
      } finally {
        setCarregando(false)
      }
    }

    buscar()
  }, [token])

  const handleEnviar = async () => {
    if (!nomeAutor.trim() || !mensagem.trim() || !pagina) return

    setEnviando(true)
    setErroEnvio(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('contribuicoes').insert({
        page_id: pagina.id,
        nome_autor: nomeAutor.trim(),
        mensagem: mensagem.trim(),
        aprovada: false,
      })

      if (error) throw error

      setEnviado(true)
    } catch {
      setErroEnvio('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9768F]" />
      </div>
    )
  }

  if (expirado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Link expirado
          </h1>
          <p className="text-gray-500">
            O prazo para colaboração nesta página já encerrou.
          </p>
        </div>
      </div>
    )
  }

  if (erro || !pagina) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Oops!
          </h1>
          <p className="text-gray-500">{erro || 'Página não encontrada.'}</p>
        </div>
      </div>
    )
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[#C9768F] fill-[#C9768F]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
            Mensagem enviada!
          </h1>
          <p className="text-gray-500">
            Sua mensagem foi recebida e será revisada antes de aparecer na página de {pagina.nome_pessoa1} e {pagina.nome_pessoa2}. Obrigado!
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 rounded-full bg-[#FEF2F5] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-[#C9768F]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Deixe uma mensagem
          </h1>
          <p className="text-gray-500">
            Para a página de <strong>{pagina.nome_pessoa1} e {pagina.nome_pessoa2}</strong>
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl border border-[#F5EDE3] p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nomeAutor">Seu nome</Label>
            <Input
              id="nomeAutor"
              value={nomeAutor}
              onChange={(e) => setNomeAutor(e.target.value)}
              placeholder="Como você se chama?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Sua mensagem</Label>
            <Textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Escreva uma mensagem especial para o casal..."
              className="min-h-[140px]"
            />
          </div>

          {erroEnvio && (
            <p className="text-red-500 text-sm">{erroEnvio}</p>
          )}

          <Button
            onClick={handleEnviar}
            disabled={!nomeAutor.trim() || !mensagem.trim() || enviando}
            size="lg"
            className="w-full"
          >
            {enviando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar mensagem
              </>
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Sua mensagem será revisada pelo criador da página antes de aparecer.
          </p>
        </div>
      </div>
    </div>
  )
}
