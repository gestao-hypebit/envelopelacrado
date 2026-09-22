import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSessionClient } from '@/lib/supabase/server'
import { buildPrompt } from '@/lib/claude'
import type { HistoriaInput } from '@/lib/claude'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const LIMITE_GERACOES_DRAFT = 3

function erro(mensagem: string, status: number) {
  return new Response(JSON.stringify({ error: mensagem }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pageId, ...dadosHistoria } = body

    if (!pageId) return erro('Requisição inválida', 400)

    const { data: pagina, error: erroBusca } = await supabase
      .from('pages')
      .select('status, user_id, narrativa_geracoes')
      .eq('id', pageId)
      .single()

    if (erroBusca || !pagina) return erro('Página não encontrada', 404)

    if (pagina.status === 'active') {
      // Página já paga: só o dono autenticado pode regenerar, sem limite de quantidade.
      const sessionClient = await createSessionClient()
      const { data: { user } } = await sessionClient.auth.getUser()

      if (!user || user.id !== pagina.user_id) {
        return erro('Não autorizado', 403)
      }
    } else {
      // Ainda em draft (fluxo de criação, antes do pagamento): limite de gerações grátis.
      if ((pagina.narrativa_geracoes ?? 0) >= LIMITE_GERACOES_DRAFT) {
        return erro('Limite de gerações grátis atingido', 429)
      }
    }

    const historia: HistoriaInput = {
      nome1: dadosHistoria.nome1,
      nome2: dadosHistoria.nome2,
      dataInicio: dadosHistoria.dataInicio,
      comoSeConheceram: dadosHistoria.comoSeConheceram,
      momentos: dadosHistoria.momentos ?? [],
      apelidos: dadosHistoria.apelidos ?? '',
      tom: dadosHistoria.tom ?? 'romantico',
    }

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: buildPrompt(historia) }],
    })

    let textoCompleto = ''
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            textoCompleto += chunk.delta.text
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        // Salva no banco antes de fechar o stream para o iframe poder ler
        if (textoCompleto) {
          const atualizacao: Record<string, unknown> = {
            narrativa_ia: textoCompleto,
            updated_at: new Date().toISOString(),
          }
          if (pagina.status !== 'active') {
            atualizacao.narrativa_geracoes = (pagina.narrativa_geracoes ?? 0) + 1
          }
          await supabase.from('pages').update(atualizacao).eq('id', pageId)
        }
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('[gerar-narrativa]', error instanceof Error ? error.message : error)
    return erro('Erro ao gerar narrativa', 500)
  }
}
