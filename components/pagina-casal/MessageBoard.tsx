'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, Loader2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import type { Resposta } from '@/types'

interface MessageBoardProps {
  pageId: string
  respostas: Resposta[]
  tema?: string
}

export default function MessageBoard({ pageId, respostas: respostasIniciais, tema = 'classico' }: MessageBoardProps) {
  const [aberto, setAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [respostas, setRespostas] = useState<Resposta[]>(respostasIniciais)
  const [erro, setErro] = useState<string | null>(null)

  const escuro = tema === 'escuro'

  const handleEnviar = async () => {
    if (!mensagem.trim()) return
    setEnviando(true)
    setErro(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('respostas')
        .insert({ page_id: pageId, mensagem: mensagem.trim() })
        .select()
        .single()

      if (error) throw error

      setRespostas((prev) => [data, ...prev])
      setMensagem('')
      setEnviado(true)
      setAberto(false)
    } catch {
      setErro('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="py-10 sm:py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Mensagens existentes */}
        {respostas.length > 0 && (
          <div className="mb-10 space-y-4">
            <h3
              className="font-display text-2xl font-bold text-center mb-6"
              style={{ color: escuro ? '#C9A96E' : '#1a1a1a' }}
            >
              Respostas
            </h3>
            {respostas.map((resposta) => (
              <motion.div
                key={resposta.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 border border-[#F5EDE3]"
                style={{ background: escuro ? '#1a1a1a' : 'white' }}
              >
                <p
                  className="leading-relaxed italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: escuro ? '#E8D5B7' : '#444',
                    fontSize: '1.05rem',
                  }}
                >
                  &ldquo;{resposta.mensagem}&rdquo;
                </p>
                <p className="text-xs mt-3 opacity-40" style={{ color: escuro ? '#C9A96E' : '#C9768F' }}>
                  {new Date(resposta.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA para responder */}
        {!enviado && (
          <div className="text-center">
            {!aberto ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  <MessageCircle
                    className="w-10 h-10 mx-auto mb-3"
                    style={{ color: '#C9768F' }}
                  />
                  <p
                    className="text-sm mb-4"
                    style={{ color: escuro ? '#E8D5B7' : '#666' }}
                  >
                    Esta página foi feita para você. Quer deixar uma mensagem de volta?
                  </p>
                </div>
                <Button
                  onClick={() => setAberto(true)}
                  size="lg"
                  className="shadow-md"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Deixar minha resposta
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-[#F5EDE3] p-4 sm:p-6 text-left shadow-lg"
                  style={{ background: escuro ? '#1a1a1a' : 'white' }}
                >
                  <h3
                    className="font-display text-xl font-bold mb-4"
                    style={{ color: escuro ? '#C9A96E' : '#1a1a1a' }}
                  >
                    Sua resposta
                  </h3>
                  <Textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Escreva o que sentiu ao ver essa página..."
                    className="min-h-[120px] mb-4"
                  />
                  {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setAberto(false)}
                      disabled={enviando}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleEnviar}
                      disabled={!mensagem.trim() || enviando}
                      className="flex-1"
                    >
                      {enviando ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar resposta
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}

        {enviado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#C9768F] fill-[#C9768F]" />
            </div>
            <p className="font-display text-xl font-bold text-gray-900 mb-2">
              Mensagem enviada!
            </p>
            <p className="text-gray-500 text-sm">
              Sua resposta foi salva para sempre nesta página.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
