import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { buildPrompt } from '@/lib/claude'
import type { HistoriaInput } from '@/lib/claude'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const LIMITE_PRE_PAGAMENTO = 2

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pageId, ...dadosHistoria } = body

    // Exige page_id — sem ele, bloqueia na hora
    if (!pageId) {
      return new Response(JSON.stringify({ error: 'Requisição inválida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Busca a página e verifica limites
    const { data: pagina, error } = await supabase
      .from('pages')
      .select('status, geracoes_count')
      .eq('id', pageId)
      .single()

    if (error || !pagina) {
      return new Response(JSON.stringify({ error: 'Página não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Página não ativa: aplica limite de gerações
    if (pagina.status !== 'active' && (pagina.geracoes_count ?? 0) >= LIMITE_PRE_PAGAMENTO) {
      return new Response(
        JSON.stringify({ error: 'Limite de gerações atingido antes do pagamento' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Incrementa o contador antes de gerar
    await supabase
      .from('pages')
      .update({ geracoes_count: (pagina.geracoes_count ?? 0) + 1 })
      .eq('id', pageId)

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

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
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
    return new Response(JSON.stringify({ error: 'Erro ao gerar narrativa' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
