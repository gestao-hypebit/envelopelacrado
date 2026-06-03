import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface HistoriaInput {
  nome1: string
  nome2: string
  dataInicio: string
  comoSeConheceram: string
  momentos: string[]
  apelidos: string
  tom?: 'romantico' | 'poetico' | 'divertido' | 'simples'
}

export function buildPrompt(historia: HistoriaInput): string {
  return `Você é um escritor especializado em histórias de amor autênticas e emocionantes.
Escreva uma narrativa poética sobre o relacionamento de ${historia.nome1} e ${historia.nome2}.

INFORMAÇÕES DO CASAL:
- Estão juntos desde: ${historia.dataInicio}
- Como se conheceram: ${historia.comoSeConheceram}
- Momentos marcantes: ${historia.momentos.join('; ')}
- Apelidos carinhosos: ${historia.apelidos}
- Tom desejado: ${historia.tom ?? 'romantico'}

INSTRUÇÕES:
- Escreva em português brasileiro
- Use os nomes reais de forma natural ao longo do texto
- 3 a 5 parágrafos curtos e bem construídos
- Tom ${historia.tom ?? 'romântico e poético'}
- Mencione os momentos marcantes de forma orgânica, não forçada
- Termine com uma frase bonita e específica sobre o futuro deles
- EVITE clichês óbvios como "dois corações que se encontraram", "amor verdadeiro" genérico
- Seja específico com os detalhes fornecidos — quanto mais específico, mais emocionante
- Não use emojis ou formatação markdown
- Escreva como se estivesse narrando a história para os dois`
}

export async function gerarNarrativa(historia: HistoriaInput): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [{ role: 'user', content: buildPrompt(historia) }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Resposta inesperada da IA')
  return content.text
}

export { client as anthropicClient }
