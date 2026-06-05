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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pageId, ...dadosHistoria } = body

    if (!pageId) {
      return new Response(JSON.stringify({ error: 'Requisição inválida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data: pagina, error } = await supabase
      .from('pages')
      .select('status')
      .eq('id', pageId)
      .single()

    if (error || !pagina) {
      return new Response(JSON.stringify({ error: 'Página não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
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
          await supabase
            .from('pages')
            .update({ narrativa_ia: textoCompleto, updated_at: new Date().toISOString() })
            .eq('id', pageId)
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
