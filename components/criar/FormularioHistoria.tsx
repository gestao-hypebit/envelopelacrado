'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tema: 'classico',
      tom: 'romantico',
      momentos: [{ titulo: '', descricao: '', data: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'momentos',
  })

  const onSubmit = (data: FormData) => {
    const dadosFormatados: DadosCriacao = {
      ...data,
      apelidos: data.apelidos ?? '',
      musicaUrl: data.musicaUrl ?? '',
      momentos: data.momentos.map((m) => ({
        titulo: m.titulo,
        descricao: m.descricao ?? '',
        data: m.data ?? '',
      })),
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
            <Input
              id="nome1"
              placeholder="Ex: Ana"
              {...register('nome1')}
            />
            {errors.nome1 && (
              <p className="text-red-500 text-xs">{errors.nome1.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome2">Nome do seu amor</Label>
            <Input
              id="nome2"
              placeholder="Ex: João"
              {...register('nome2')}
            />
            {errors.nome2 && (
              <p className="text-red-500 text-xs">{errors.nome2.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Seu email <span className="text-gray-400 text-xs">(para receber o link e o QR Code)</span></Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataInicio">Quando começou o relacionamento?</Label>
          <Input
            id="dataInicio"
            type="date"
            {...register('dataInicio')}
          />
          {errors.dataInicio && (
            <p className="text-red-500 text-xs">{errors.dataInicio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apelidos">Apelidos carinhosos <span className="text-gray-400 text-xs">(opcional)</span></Label>
          <Input
            id="apelidos"
            placeholder="Ex: meu amor, chuchu, gatinho..."
            {...register('apelidos')}
          />
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

      {/* Momentos marcantes */}
      <div className="bg-white rounded-2xl p-6 border border-[#F5EDE3] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-gray-900">
            Momentos marcantes
          </h3>
          <span className="text-xs text-gray-400">{fields.length}/5</span>
        </div>

        <p className="text-sm text-gray-500">
          Os momentos que a IA vai mencionar na narrativa. Seja específico!
        </p>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-[#F5EDE3] rounded-xl p-4 space-y-3 bg-[#FAFAF8]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#C9768F]">
                  Momento {index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Input
                placeholder="Título do momento (ex: Primeira viagem juntos)"
                {...register(`momentos.${index}.titulo`)}
              />
              {errors.momentos?.[index]?.titulo && (
                <p className="text-red-500 text-xs">{errors.momentos[index]?.titulo?.message}</p>
              )}
              <Textarea
                placeholder="Descreve o momento com detalhes... (opcional)"
                className="min-h-[80px]"
                {...register(`momentos.${index}.descricao`)}
              />
              <Input
                type="date"
                {...register(`momentos.${index}.data`)}
              />
            </div>
          ))}
        </div>

        {fields.length < 5 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ titulo: '', descricao: '', data: '' })}
            className="w-full"
          >
            <Plus className="w-4 h-4" />
            Adicionar momento
          </Button>
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
          {errors.musicaUrl && (
            <p className="text-red-500 text-xs">{errors.musicaUrl.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Salvando...' : 'Próximo: Fotos →'}
      </Button>
    </form>
  )
}
