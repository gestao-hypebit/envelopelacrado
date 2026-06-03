'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PaginaComMomentos } from '@/types'

interface UsePaginaCasalReturn {
  pagina: PaginaComMomentos | null
  carregando: boolean
  erro: string | null
}

export function usePaginaCasal(slug: string): UsePaginaCasalReturn {
  const [pagina, setPagina] = useState<PaginaComMomentos | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const buscar = async () => {
      try {
        const supabase = createClient()

        const { data: paginaData, error: paginaError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'active')
          .single()

        if (paginaError || !paginaData) {
          setErro('Página não encontrada')
          return
        }

        const { data: momentosData } = await supabase
          .from('momentos')
          .select('*')
          .eq('page_id', paginaData.id)
          .order('ordem', { ascending: true })

        const { data: contribuicoesData } = await supabase
          .from('contribuicoes')
          .select('*')
          .eq('page_id', paginaData.id)
          .eq('aprovada', true)
          .order('created_at', { ascending: false })

        setPagina({
          ...paginaData,
          momentos: momentosData ?? [],
          contribuicoes: contribuicoesData ?? [],
        })
      } catch {
        setErro('Erro ao carregar página')
      } finally {
        setCarregando(false)
      }
    }

    buscar()
  }, [slug])

  return { pagina, carregando, erro }
}
