'use client'

import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Check, ImagePlus, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import type { DadosCriacao } from '@/types'

const schema = z.object({
  nome1: z.string().min(2, 'Nome muito curto').max(50),
  nome2: z.string().min(2, 'Nome muito curto').max(50),
  email: z.string().email('Email inválido'),
  dataInicio: z.string().min(1, 'Informe a data'),
  comoSeConheceram: z.string().min(20, 'Conta mais detalhes! Quanto mais específico, mais bonito fica.').max(10000),
  momentos: z
    .array(
      z.object({
        titulo: z.string().min(2, 'Informe o título'),
        descricao: z.string(),
        data: z.string(),
      })
    )
    .min(1, 'Adicione pelo menos um momento')
    .max(5),
  apelidos: z.string().max(100),
  musicaUrl: z.string(),
  tema: z.enum(['classico', 'escuro', 'pastel', 'floral']),
  tom: z.enum(['romantico', 'poetico', 'divertido', 'simples']),
})

type FormData = z.infer<typeof schema>

export default function FormularioHistoria() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tema: 'classico',
      tom: 'romantico',
      momentos: [{ titulo: '', descricao: '', data: '' }],
    },
  })

  // Fotos dos momentos: estado separado (File não serializa para zod/JSON)
  const [momentoArquivos, setMomentoArquivos] = useState<(File | null)[]>([null])
  const [momentoPreviews, setMomentoPreviews] = useState<(string | null)[]>([null])
  const fotoRefs = useRef<(HTMLInputElement | null)[]>([])

  // Restaura dados se usuário voltou para este step
  useEffect(() => {
    const saved = sessionStorage.getItem('memoriai_step2')
    if (!saved) return
    try {
      const dados = JSON.parse(saved)
      reset({
        nome1: dados.nome1 ?? '',
        nome2: dados.nome2 ?? '',
        email: dados.email ?? '',
        dataInicio: dados.dataInicio ?? '',
        comoSeConheceram: dados.comoSeConheceram ?? '',
        momentos: dados.momentos?.length > 0
          ? dados.momentos
          : [{ titulo: '', descricao: '', data: '' }],
        apelidos: dados.apelidos ?? '',
        musicaUrl: dados.musicaUrl ?? '',
        tema: dados.tema ?? 'classico',
        tom: dados.tom ?? 'romantico',
      })
      // Restaura previews de fotos já enviadas anteriormente
      if (dados.momentos?.length > 0) {
        const previews = dados.momentos.map((m: { fotoUrl?: string }) => m.fotoUrl ?? null)
        setMomentoPreviews(previews)
        setMomentoArquivos(previews.map(() => null))
      }
    } catch {}
  }, [reset])

  const { fields, append, remove } = useFieldArray({ control, name: 'momentos' })
  const momentosWatch = useWatch({ control, name: 'momentos' })

  // Sincroniza arrays de fotos com o array de campos
  useEffect(() => {
    setMomentoArquivos((prev) => {
      const arr = [...prev]
      while (arr.length < fields.length) arr.push(null)
      return arr.slice(0, fields.length)
    })
    setMomentoPreviews((prev) => {
      const arr = [...prev]
      while (arr.length < fields.length) arr.push(null)
      return arr.slice(0, fields.length)
    })
  }, [fields.length])

  const handleFotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    const url = URL.createObjectURL(arquivo)
    setMomentoArquivos((prev) => { const a = [...prev]; a[index] = arquivo; return a })
    setMomentoPreviews((prev) => { const a = [...prev]; a[index] = url; return a })
  }

  const removerFoto = (index: number) => {
    setMomentoArquivos((prev) => { const a = [...prev]; a[index] = null; return a })
    setMomentoPreviews((prev) => { const a = [...prev]; a[index] = null; return a })
    if (fotoRefs.current[index]) fotoRefs.current[index]!.value = ''
  }

  const removerMomento = (index: number) => {
    remove(index)
    setMomentoArquivos((prev) => prev.filter((_, i) => i !== index))
    setMomentoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    const fotoUrls: (string | null)[] = []

    for (let i = 0; i < data.momentos.length; i++) {
      const arquivo = momentoArquivos[i]
      // Mantém URL já salva se não trocou o arquivo
      const previewAnterior = momentoPreviews[i]
      const isObjectUrl = previewAnterior?.startsWith('blob:')

      if (arquivo) {
        const ext = arquivo.name.split('.').pop()
        const nome = `momentos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data: uploaded, error } = await supabase.storage
          .from('fotos-momentos')
          .upload(nome, arquivo, { contentType: arquivo.type, cacheControl: '3600' })
        fotoUrls.push(!error && uploaded
          ? supabase.storage.from('fotos-momentos').getPublicUrl(uploaded.path).data.publicUrl
          : null)
      } else if (previewAnterior && !isObjectUrl) {
        // URL do Supabase já salva numa sessão anterior
        fotoUrls.push(previewAnterior)
      } else {
        fotoUrls.push(null)
      }
    }

    const dadosFormatados: DadosCriacao = {
      ...data,
      apelidos: data.apelidos ?? '',
      musicaUrl: data.musicaUrl ?? '',
      momentos: data.momentos.map((m, i) => ({
        titulo: m.titulo,
        descricao: m.descricao ?? '',
        data: m.data ?? '',
        fotoUrl: fotoUrls[i] ?? undefined,
      })),
    }

    // Invalida narrativa se história mudou
    const salvoAnterior = sessionStorage.getItem('memoriai_step2')
    if (salvoAnterior) {
      try {
        const anterior = JSON.parse(salvoAnterior) as DadosCriacao
        const historiaAlterada =
          anterior.nome1 !== dadosFormatados.nome1 ||
          anterior.nome2 !== dadosFormatados.nome2 ||
          anterior.comoSeConheceram !== dadosFormatados.comoSeConheceram ||
          anterior.momentos.length !== dadosFormatados.momentos.length ||
          anterior.tom !== dadosFormatados.tom
        if (historiaAlterada) {
          sessionStorage.removeItem('memoriai_narrativa')
          sessionStorage.removeItem('memoriai_page_id')
          sessionStorage.removeItem('memoriai_slug')
          sessionStorage.removeItem('memoriai_preview_token')
          sessionStorage.removeItem('memoriai_step3')
        }
      } catch {}
    }

    sessionStorage.setItem('memoriai_step2', JSON.stringify(dadosFormatados))
    router.push('/criar/fotos')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Nomes */}
      <div className="bg-white rounded-2xl p-6 border border-[#F5EDE3] space-y-4">
        <h3 className="font-display text-xl font-bold text-gray-900">O casal</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome1">Seu nome</Label>
            <Input id="nome1" placeholder="Ex: Ana" {...register('nome1')} />
            {errors.nome1 && <p className="text-red-500 text-xs">{errors.nome1.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome2">Nome do seu amor</Label>
            <Input id="nome2" placeholder="Ex: João" {...register('nome2')} />
            {errors.nome2 && <p className="text-red-500 text-xs">{errors.nome2.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Seu email <span className="text-gray-400 text-xs">(para receber o link e o QR Code)</span>
          </Label>
          <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataInicio">Quando começou o relacionamento?</Label>
          <Input id="dataInicio" type="date" {...register('dataInicio')} />
          {errors.dataInicio && <p className="text-red-500 text-xs">{errors.dataInicio.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apelidos">
            Apelidos carinhosos <span className="text-gray-400 text-xs">(opcional)</span>
          </Label>
          <Input id="apelidos" placeholder="Ex: meu amor, chuchu, gatinho..." {...register('apelidos')} />
        </div>
      </div>

      {/* História */}
      <div className="bg-white rounded-2xl p-6 border border-[#F5EDE3] space-y-4">
        <h3 className="font-display text-xl font-bold text-gray-900">A história</h3>

        <div className="space-y-2">
          <Label htmlFor="comoSeConheceram">Como vocês se conheceram?</Label>
          <Textarea
            id="comoSeConheceram"
            placeholder="Conta com detalhes... Onde foi? O que aconteceu? Quem falou primeiro? Quanto mais específico, mais emocionante a IA vai escrever!"
            className="min-h-[160px]"
            {...register('comoSeConheceram')}
          />
          {errors.comoSeConheceram && (
            <p className="text-red-500 text-xs">{errors.comoSeConheceram.message}</p>
          )}
        </div>
      </div>

      {/* Momentos marcantes — aparecem como polaroids na timeline */}
      <div className="bg-white rounded-2xl p-6 border border-[#F5EDE3] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-gray-900">Momentos marcantes</h3>
          <span className="text-xs text-gray-400">
            {momentosWatch?.filter(m => m?.titulo?.trim()).length ?? 0}/{fields.length} preenchidos
          </span>
        </div>

        <div className="rounded-xl bg-[#FEF2F5] border border-[#F5C6D3] px-4 py-3 text-sm text-[#a05068] leading-relaxed">
          Esses momentos viram os <strong>polaroids da timeline</strong>. Você pode adicionar uma foto
          a cada um (opcional) — ela aparece no polaroid. As fotos da galeria você adiciona na próxima etapa, separado.
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const titulo = momentosWatch?.[index]?.titulo?.trim() ?? ''
            const preenchido = titulo.length >= 2
            const preview = momentoPreviews[index]

            return (
              <div
                key={field.id}
                className={`border rounded-xl overflow-hidden transition-colors ${
                  preenchido ? 'border-green-200' : 'border-[#F5EDE3]'
                }`}
              >
                {/* Header do card */}
                <div className={`flex items-center justify-between px-4 py-2.5 ${preenchido ? 'bg-green-50/40' : 'bg-[#FAFAF8]'}`}>
                  {preenchido ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Incluído na história
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#C9768F]">Momento {index + 1}</span>
                  )}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerMomento(index)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Conteúdo: foto à esquerda, campos à direita */}
                <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] gap-0">
                  {/* Miniatura da foto */}
                  <div className="hidden sm:block relative bg-[#F5EDE3] border-r border-[#F5EDE3]">
                    {preview ? (
                      <div className="relative w-24 h-full min-h-[120px]">
                        <Image src={preview} alt="foto do momento" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removerFoto(index)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fotoRefs.current[index]?.click()}
                        className="w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-1 hover:bg-[#F0E4D4] transition-colors"
                        title="Adicionar foto ao polaroid"
                      >
                        <ImagePlus className="w-5 h-5 text-[#C9768F] opacity-50" />
                        <span className="text-[10px] text-gray-400 text-center leading-tight px-1">
                          foto<br />opcional
                        </span>
                      </button>
                    )}
                    <input
                      ref={(el) => { fotoRefs.current[index] = el }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFotoChange(index, e)}
                    />
                  </div>

                  {/* Campos de texto */}
                  <div className="p-4 space-y-3">
                    <Input
                      placeholder="Título do momento (ex: Primeira viagem juntos)"
                      {...register(`momentos.${index}.titulo`)}
                    />
                    {errors.momentos?.[index]?.titulo && (
                      <p className="text-red-500 text-xs">{errors.momentos[index]?.titulo?.message}</p>
                    )}
                    <Textarea
                      placeholder="Descreve com detalhes... (opcional, enriquece a narrativa)"
                      className="min-h-[72px]"
                      {...register(`momentos.${index}.descricao`)}
                    />
                    <Input type="date" {...register(`momentos.${index}.data`)} />

                    {/* Botão de foto — visível apenas no mobile */}
                    <div className="sm:hidden">
                      {preview ? (
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                            <Image src={preview} alt="foto" fill className="object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removerFoto(index)}
                            className="text-xs text-red-400 hover:underline"
                          >
                            Remover foto
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fotoRefs.current[index]?.click()}
                          className="flex items-center gap-1.5 text-xs text-[#C9768F] hover:underline"
                        >
                          <ImagePlus className="w-3.5 h-3.5" /> Adicionar foto ao polaroid (opcional)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {fields.length < 5 && (momentosWatch?.[fields.length - 1]?.titulo?.trim().length ?? 0) >= 2 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ titulo: '', descricao: '', data: '' })}
            className="w-full border-dashed border-[#C9768F] text-[#C9768F] hover:bg-[#C9768F]/5"
          >
            <Plus className="w-4 h-4" />
            + Adicionar mais um momento
          </Button>
        )}

        {errors.momentos && typeof errors.momentos.message === 'string' && (
          <p className="text-red-500 text-xs">{errors.momentos.message}</p>
        )}
      </div>

      {/* Personalização */}
      <div className="bg-white rounded-2xl p-6 border border-[#F5EDE3] space-y-4">
        <h3 className="font-display text-xl font-bold text-gray-900">Personalização</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tema">Tema visual</Label>
            <div className="relative">
              <Select id="tema" {...register('tema')}>
                <option value="classico">Clássico (off-white + rosa)</option>
                <option value="escuro">Escuro (preto + dourado)</option>
                <option value="pastel">Pastel (lavanda + lilás)</option>
                <option value="floral">Floral (branco + verde sage)</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tom">Tom da narrativa</Label>
            <div className="relative">
              <Select id="tom" {...register('tom')}>
                <option value="romantico">Romântico</option>
                <option value="poetico">Poético</option>
                <option value="divertido">Divertido e leve</option>
                <option value="simples">Simples e sincero</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="musicaUrl">
            Música especial <span className="text-gray-400 text-xs">(link do YouTube ou Spotify, opcional)</span>
          </Label>
          <Input
            id="musicaUrl"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            {...register('musicaUrl')}
          />
          {errors.musicaUrl && <p className="text-red-500 text-xs">{errors.musicaUrl.message}</p>}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Salvando...' : 'Próximo: Fotos da galeria →'}
      </Button>
    </form>
  )
}
