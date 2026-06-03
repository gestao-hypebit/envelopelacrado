import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function gerarSlug(nome1: string, nome2: string): string {
  const normalizar = (s: string) =>
    s.toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '')

  const base = `${normalizar(nome1)}-e-${normalizar(nome2)}`
  const sufixo = Math.random().toString(36).slice(2, 6)
  return `${base}-${sufixo}`
}

export function formatarData(data: string): string {
  const date = new Date(data + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function calcularTempoJuntos(dataInicio: string): string {
  const inicio = new Date(dataInicio + 'T00:00:00')
  const agora = new Date()
  const diffMs = agora.getTime() - inicio.getTime()
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const anos = Math.floor(diffDias / 365)
  const mesesRestantes = Math.floor((diffDias % 365) / 30)

  if (anos > 0 && mesesRestantes > 0) {
    return `${anos} ano${anos > 1 ? 's' : ''} e ${mesesRestantes} ${mesesRestantes > 1 ? 'meses' : 'mês'}`
  }
  if (anos > 0) {
    return `${anos} ano${anos > 1 ? 's' : ''}`
  }
  if (mesesRestantes > 0) {
    return `${mesesRestantes} ${mesesRestantes > 1 ? 'meses' : 'mês'}`
  }
  return `${diffDias} dias`
}

export function gerarUrlColaboracao(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br'
  return `${baseUrl}/colaborar/${token}`
}

export function gerarUrlPagina(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://envelopelacrado.com.br'
  return `${baseUrl}/p/${slug}`
}
