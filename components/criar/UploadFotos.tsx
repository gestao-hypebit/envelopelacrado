'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ImagePlus, X, Calendar, Loader2, Images } from 'lucide-react'
import type { MomentoComFoto } from '@/types'
import Image from 'next/image'

interface FotoItem {
  id: string
  arquivo?: File
  preview: string | null
  foto_url: string | null
  titulo: string
  data: string
}

function gerarId() {
  return Math.random().toString(36).slice(2)
}

function FotoCard({
  item,
  onChange,
  onRemove,
}: {
  item: FotoItem
  onChange: (id: string, campo: keyof FotoItem, valor: string | File | null) => void
  onRemove: (id: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    onChange(item.id, 'arquivo', arquivo)
  }

  const remover = () => {
    if (inputRef.current) inputRef.current.value = ''
    onRemove(item.id)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#F5EDE3] overflow-hidden">
      {/* Área da foto */}
      <div className="relative aspect-[4/3] bg-[#FAFAF8]">
        {item.preview ? (
          <>
            <Image src={item.preview} alt={item.titulo || 'Foto'} fill className="object-cover" />
            <button
              type="button"
              onClick={remover}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              title="Remover foto"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-[#F5EDE3] transition-colors"
          >
            <ImagePlus className="w-8 h-8 text-[#C9768F] opacity-50" />
            <span className="text-xs text-gray-400 font-medium">Clique para escolher</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleArquivo} />
      </div>

      {/* Campos */}
      <div className="p-3 space-y-2">
        <input
          type="text"
          value={item.titulo}
          onChange={(e) => onChange(item.id, 'titulo', e.target.value)}
          placeholder="Legenda (opcional)"
          className="w-full text-sm text-gray-700 bg-transparent border-b border-[#F5EDE3] focus:border-[#C9768F] outline-none pb-1 transition-colors placeholder:text-gray-300"
        />
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <input
            type="date"
            value={item.data}
            onChange={(e) => onChange(item.id, 'data', e.target.value)}
            className="bg-transparent outline-none text-gray-500 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default function UploadFotos() {
  const router = useRouter()
  const [fotos, setFotos] = useState<FotoItem[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    // Redireciona se pulou o step 2
    const dadosStep2 = sessionStorage.getItem('memoriai_step2')
    if (!dadosStep2) {
      router.push('/criar/historia')
      return
    }

    // Restaura fotos se o usuário voltou do step 4
    const dadosStep3 = sessionStorage.getItem('memoriai_step3')
    if (dadosStep3) {
      try {
        const step3 = JSON.parse(dadosStep3)
        if (step3.fotos?.length > 0) {
          setFotos(
            step3.fotos.map((f: MomentoComFoto) => ({
              id: gerarId(),
              foto_url: f.foto_url ?? null,
              preview: f.foto_url ?? null,
              titulo: f.titulo ?? '',
              data: f.data ?? '',
            }))
          )
        }
      } catch {}
    }
    // Inicia vazio — fotos são opcionais e independentes dos momentos narrativos
  }, [router])

  const adicionarSlot = () => {
    if (fotos.length >= 8) return
    setFotos((prev) => [
      ...prev,
      { id: gerarId(), arquivo: undefined, preview: null, foto_url: null, titulo: '', data: '' },
    ])
  }

  const handleChange = (id: string, campo: keyof FotoItem, valor: string | File | null) => {
    setFotos((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f
        if (campo === 'arquivo' && valor instanceof File) {
          const preview = URL.createObjectURL(valor)
          return { ...f, arquivo: valor, preview }
        }
        return { ...f, [campo]: valor }
      })
    )
  }

  const handleRemove = (id: string) => {
    setFotos((prev) => prev.filter((f) => f.id !== id))
  }

  const handleContinuar = async () => {
    setCarregando(true)
    setErro(null)

    try {
      const supabase = createClient()
      const fotosProcessadas: MomentoComFoto[] = []

      for (const foto of fotos) {
        // Ignora slots sem foto e sem legenda
        if (!foto.arquivo && !foto.foto_url && !foto.titulo.trim()) continue

        let fotoUrl = foto.foto_url

        if (foto.arquivo) {
          const ext = foto.arquivo.name.split('.').pop()
          const nome = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { data, error } = await supabase.storage
            .from('fotos-momentos')
            .upload(nome, foto.arquivo, { contentType: foto.arquivo.type, cacheControl: '3600' })

          if (!error && data) {
            const { data: urlData } = supabase.storage.from('fotos-momentos').getPublicUrl(data.path)
            fotoUrl = urlData.publicUrl
          }
        }

        fotosProcessadas.push({
          titulo: foto.titulo.trim() || 'Foto',
          descricao: '',
          data: foto.data,
          foto_url: fotoUrl,
        })
      }

      // Salva em formato compatível com o restante do fluxo
      sessionStorage.setItem(
        'memoriai_step3',
        JSON.stringify({
          fotos: fotosProcessadas,
          momentos: fotosProcessadas, // compatibilidade com API de criação
        })
      )
      router.push('/criar/preview')
    } catch {
      setErro('Erro ao processar fotos. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const fotosComArquivo = fotos.filter((f) => f.arquivo || f.foto_url)

  return (
    <div className="space-y-6">
      {/* Header informativo */}
      <div className="bg-white rounded-2xl p-5 border border-[#F5EDE3]">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FEF2F5] flex items-center justify-center flex-shrink-0">
            <Images className="w-4 h-4 text-[#C9768F]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Fotos para a galeria</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Adicione até 8 fotos que aparecem na galeria da página. Esta etapa é opcional —
              você pode pular e adicionar fotos depois pelo painel.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de fotos */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fotos.map((foto) => (
            <FotoCard
              key={foto.id}
              item={foto}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {fotos.length === 0 && (
        <div
          onClick={adicionarSlot}
          className="w-full py-12 rounded-2xl border-2 border-dashed border-[#E8D5C9] text-[#C9768F] hover:border-[#C9768F] hover:bg-[#FEF2F5] transition-all flex flex-col items-center justify-center gap-3 cursor-pointer"
        >
          <ImagePlus className="w-8 h-8 opacity-60" />
          <div className="text-center">
            <p className="text-sm font-medium">Clique para adicionar a primeira foto</p>
            <p className="text-xs text-gray-400 mt-1">Ou clique em "Próximo" para pular esta etapa</p>
          </div>
        </div>
      )}

      {/* Botão adicionar mais */}
      {fotos.length > 0 && fotos.length < 8 && (
        <button
          type="button"
          onClick={adicionarSlot}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#E8D5C9] text-[#C9768F] hover:border-[#C9768F] hover:bg-[#FEF2F5] transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          + Adicionar foto ({fotos.length}/8)
        </button>
      )}

      {fotosComArquivo.length > 0 && (
        <p className="text-xs text-center text-gray-400">
          {fotosComArquivo.length} {fotosComArquivo.length === 1 ? 'foto selecionada' : 'fotos selecionadas'}
        </p>
      )}

      {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="lg" onClick={() => router.push('/criar/historia')} disabled={carregando}>
          ← Voltar
        </Button>
        <Button size="lg" onClick={handleContinuar} disabled={carregando} className="flex-1">
          {carregando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando fotos...
            </>
          ) : fotos.length === 0 ? (
            'Próximo: Preview → (pular fotos)'
          ) : (
            'Próximo: Preview →'
          )}
        </Button>
      </div>
    </div>
  )
}
