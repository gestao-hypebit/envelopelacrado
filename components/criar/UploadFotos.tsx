'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import MomentoItem from './MomentoItem'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import type { DadosCriacao, MomentoComFoto } from '@/types'

export default function UploadFotos() {
  const router = useRouter()
  const [momentos, setMomentos] = useState<MomentoComFoto[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const dadosStep2 = sessionStorage.getItem('memoriai_step2')
    if (!dadosStep2) {
      router.push('/criar/historia')
      return
    }

    const dados: DadosCriacao = JSON.parse(dadosStep2)
    // Pré-popula com os momentos do formulário
    const momentosIniciais: MomentoComFoto[] = dados.momentos.slice(0, 8).map((m) => ({
      titulo: m.titulo,
      descricao: m.descricao,
      data: m.data,
      foto_url: null,
    }))

    // Garante pelo menos 1 slot vazio se não tiver momentos
    if (momentosIniciais.length === 0) {
      momentosIniciais.push({ titulo: '', descricao: '', data: '', foto_url: null })
    }

    setMomentos(momentosIniciais)
  }, [router])

  const handleChange = (index: number, campo: keyof MomentoComFoto, valor: string | File | null) => {
    setMomentos((prev) => {
      const novos = [...prev]
      if (campo === 'arquivo') {
        novos[index] = { ...novos[index], arquivo: valor as File | undefined }
      } else {
        novos[index] = { ...novos[index], [campo]: valor }
      }
      return novos
    })
  }

  const adicionarMomento = () => {
    if (momentos.length >= 8) return
    setMomentos((prev) => [...prev, { titulo: '', descricao: '', data: '', foto_url: null }])
  }

  const handleContinuar = async () => {
    if (momentos.every((m) => !m.titulo.trim())) {
      setErro('Adicione pelo menos um momento com título')
      return
    }

    setCarregando(true)
    setErro(null)

    try {
      const supabase = createClient()
      const momentosProcessados: MomentoComFoto[] = []

      for (const momento of momentos) {
        if (!momento.titulo.trim()) continue

        let fotoUrl = momento.foto_url

        if (momento.arquivo) {
          const extensao = momento.arquivo.name.split('.').pop()
          const nomeArquivo = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`

          const { data, error } = await supabase.storage
            .from('fotos-momentos')
            .upload(nomeArquivo, momento.arquivo, {
              contentType: momento.arquivo.type,
              cacheControl: '3600',
            })

          if (!error && data) {
            const { data: urlData } = supabase.storage
              .from('fotos-momentos')
              .getPublicUrl(data.path)
            fotoUrl = urlData.publicUrl
          }
        }

        momentosProcessados.push({
          titulo: momento.titulo,
          descricao: momento.descricao,
          data: momento.data,
          foto_url: fotoUrl,
        })
      }

      sessionStorage.setItem('memoriai_step3', JSON.stringify({ momentos: momentosProcessados }))
      router.push('/criar/preview')
    } catch {
      setErro('Erro ao processar fotos. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="space-y-4">
      {momentos.map((momento, index) => (
        <MomentoItem
          key={index}
          momento={momento}
          index={index}
          onChange={handleChange}
        />
      ))}

      {momentos.length < 8 && (
        <button
          type="button"
          onClick={adicionarMomento}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-[#E8D5C9] text-[#C9768F] hover:border-[#C9768F] hover:bg-[#FEF2F5] transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Adicionar outro momento ({momentos.length}/8)
        </button>
      )}

      {erro && (
        <p className="text-red-500 text-sm text-center">{erro}</p>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/criar/historia')}
          disabled={carregando}
        >
          ← Voltar
        </Button>
        <Button
          size="lg"
          onClick={handleContinuar}
          disabled={carregando}
          className="flex-1"
        >
          {carregando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando fotos...
            </>
          ) : (
            'Próximo: Preview →'
          )}
        </Button>
      </div>
    </div>
  )
}
