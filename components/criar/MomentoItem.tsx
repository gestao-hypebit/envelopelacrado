'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ImagePlus, X, Calendar } from 'lucide-react'
import type { MomentoComFoto } from '@/types'

interface MomentoItemProps {
  momento: MomentoComFoto
  index: number
  onChange: (index: number, campo: keyof MomentoComFoto, valor: string | File | null) => void
  fotoObrigatoria?: boolean
}

export default function MomentoItem({ momento, index, onChange, fotoObrigatoria = false }: MomentoItemProps) {
  const [preview, setPreview] = useState<string | null>(momento.foto_url)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    const url = URL.createObjectURL(arquivo)
    setPreview(url)
    onChange(index, 'arquivo', arquivo)
  }

  const removerFoto = () => {
    setPreview(null)
    onChange(index, 'arquivo', null)
    onChange(index, 'foto_url', null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-colors ${fotoObrigatoria ? 'border-red-300' : 'border-[#F5EDE3]'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {/* Área de foto */}
        <div className="sm:col-span-1 relative">
          {preview ? (
            <div className="relative aspect-square sm:h-full">
              <Image
                src={preview}
                alt={momento.titulo}
                fill
                className="object-cover"
              />
              <button
                onClick={removerFoto}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={`w-full aspect-square sm:h-full min-h-[120px] flex flex-col items-center justify-center gap-2 transition-colors border-r ${
                fotoObrigatoria
                  ? 'bg-red-50 border-red-200 hover:bg-red-100'
                  : 'bg-[#FAFAF8] border-[#F5EDE3] hover:bg-[#F5EDE3]'
              }`}
            >
              <ImagePlus className={`w-8 h-8 ${fotoObrigatoria ? 'text-red-400' : 'text-[#C9768F] opacity-60'}`} />
              <span className={`text-xs font-medium ${fotoObrigatoria ? 'text-red-500' : 'text-gray-400'}`}>
                {fotoObrigatoria ? 'Foto obrigatória' : 'Adicionar foto'}
              </span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleArquivo}
          />
        </div>

        {/* Dados do momento */}
        <div className="sm:col-span-2 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C9768F] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
              {index + 1}
            </span>
            <input
              type="text"
              value={momento.titulo}
              onChange={(e) => onChange(index, 'titulo', e.target.value)}
              placeholder="Título do momento"
              className="flex-1 text-sm font-semibold text-gray-900 bg-transparent border-b border-[#F5EDE3] focus:border-[#C9768F] outline-none pb-1 transition-colors"
            />
          </div>

          <textarea
            value={momento.descricao}
            onChange={(e) => onChange(index, 'descricao', e.target.value)}
            placeholder="Descrição (opcional)"
            rows={2}
            className="w-full text-sm text-gray-600 bg-transparent resize-none outline-none placeholder:text-gray-300"
          />

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <input
              type="date"
              value={momento.data}
              onChange={(e) => onChange(index, 'data', e.target.value)}
              className="bg-transparent outline-none text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
